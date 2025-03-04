package com.sima

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.margelo.nitro.core.Promise
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.IOException
import java.io.InputStream
import java.security.InvalidKeyException
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import java.security.Signature
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import java.util.UUID
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class SimaActivity : AppCompatActivity() {
    var signChallengeActivityResultLauncher: ActivityResultLauncher<Intent>? = null
    lateinit var challenge: ByteArray
    private val PACKAGE_NAME: String = "az.dpc.sima"
    private val SIGN_CHALLENGE_OPERATION: String =
        "sima.sign.challenge"
    private val SIMA_SIGNATURE_ALGORITHM: String = "SHA256withECDSA"
    private val CLIENT_SIGNATURE_ALGORITHM: String = "HmacSHA256"
    private val CLIENT_HASH_ALGORITHM: String = "SHA-256"

    // Intent extra field keys
    private val EXTRA_CLIENT_ID_FIELD: String = "client_id"
    private val EXTRA_SERVICE_FIELD: String = "service_name"
    private val EXTRA_CHALLENGE_FIELD: String = "challenge"
    private val EXTRA_SIGNATURE_FIELD: String = "signature"
    private val EXTRA_USER_CODE_FIELD: String = "user_code"
    private val EXTRA_REQUEST_ID_FIELD: String = "request_id"
    private val EXTRA_LOGO_FIELD: String = "service_logo"

    var EXTRA_USER_CODE_VALUE: String = ""
    var EXTRA_SERVICE_VALUE: String = ""
    var EXTRA_CLIENT_ID_VALUE: Double = 1.00
    var CLIENT_MASTER_KEY: String = ""
    var LOGO: String = ""


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sima)
        val requestId = intent?.getStringExtra("request_id")
        var currentPromise = requestId?.let { HybridSima.promiseMap[it] }

        if (currentPromise == null) {
            Log.e("SimaActivity", "Could not find promise for request ID: $requestId")
            currentPromise = Promise<String>()
            finish()
            return
        }

        intent?.let { intent ->
            EXTRA_SERVICE_VALUE = intent.getStringExtra(EXTRA_SERVICE_FIELD) ?: ""
            EXTRA_USER_CODE_VALUE = intent.getStringExtra(EXTRA_USER_CODE_FIELD) ?: ""
            EXTRA_CLIENT_ID_VALUE = intent.getDoubleExtra(EXTRA_CLIENT_ID_FIELD, 1.00)
            CLIENT_MASTER_KEY = intent.getStringExtra("master_key") ?: ""
            LOGO = intent.getStringExtra(EXTRA_LOGO_FIELD) ?: ""
        }

        this.signChallengeActivityResultLauncher = registerForActivityResult<Intent, ActivityResult>(
            ActivityResultContracts.StartActivityForResult()
        ) { result: ActivityResult ->
            try {
                if (result.resultCode == RESULT_OK) {
                    val simaIntent = result.data

                    if (simaIntent == null) {
                        Log.e("sima result is null", "null")
                        currentPromise.reject(SimaException("empty-response"))
                        intent?.getStringExtra("request_id")?.let { HybridSima.promiseMap.remove(it) }
                        finish()
                        return@registerForActivityResult
                    }


                    val status = simaIntent.getStringExtra("status")
                    val message = simaIntent.getStringExtra("message")

                    if (status == null || status != "success") {
                        Log.e("sima didn't finish successfully", "null")
                        Log.e("the message", message.toString())
                        Log.i("currentPromise", currentPromise.toString())
                        currentPromise.reject(SimaException(message.toString()))
                        intent?.getStringExtra("request_id")?.let { HybridSima.promiseMap.remove(it) }
                        finish()
                        return@registerForActivityResult

                    }


                    Log.e("sima is successfull", intent.toString())

                    val signatureBytes = simaIntent.getByteArrayExtra("signature")
                    val certificateBytes = simaIntent.getByteArrayExtra("certificate")

                    val cf = CertificateFactory.getInstance("X.509")
                    val certStream: InputStream = ByteArrayInputStream(certificateBytes)
                    val certificate =
                        cf.generateCertificate(certStream) as X509Certificate

                    val s = Signature.getInstance(SIMA_SIGNATURE_ALGORITHM)
                    s.initVerify(certificate)
                    s.update(challenge)

                    if (s.verify(signatureBytes)) {
                        val subject = certificate.subjectDN
                        val subjectDataAsString = subject.toString()
                        val resultList = subjectDataAsString.split(",")

                        val resultMap = resultList.fold(mutableMapOf<String, String>()) { first, second ->
                            val (key, value) = second.split("=")
                            first[key.trim().lowercase()] = value.trim()
                            first
                        }

                        val response = JSONObject(resultMap.toMap()).toString()

                        currentPromise.resolve(response)

                    } else {
                        currentPromise.reject(Throwable("signature-verification-error"))

                    }
                } else if (result.resultCode == RESULT_CANCELED) {
                    currentPromise.reject(Throwable("operation-canceled"))

                }
            } catch (e: Exception) {
                e.printStackTrace()
                currentPromise.reject(Throwable("parse-result-error"))
            }
            intent?.getStringExtra("request_id")?.let { HybridSima.promiseMap.remove(it) }
            finish()
        }

        signChallenge()
    }

    private fun signChallenge() {
        try {
            var intent = packageManager.getLaunchIntentForPackage(PACKAGE_NAME)
            if (intent == null) {
                intent = try {
                    Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + PACKAGE_NAME))
                } catch (e: java.lang.Exception) {
                    Intent(
                        Intent.ACTION_VIEW,
                        Uri.parse("https://play.google.com/store/apps/details?id=" + PACKAGE_NAME)
                    )
                }
            } else {
                try {
                    val random = SecureRandom()
                    this.challenge = ByteArray(64)
                    random.nextBytes(this.challenge)

                    val md = MessageDigest.getInstance(CLIENT_HASH_ALGORITHM)
                    md.update(this.challenge)
                    val hash = md.digest()

                    val mac = Mac.getInstance(CLIENT_SIGNATURE_ALGORITHM)
                    mac.init(
                        SecretKeySpec(
                            CLIENT_MASTER_KEY.toByteArray(),
                            CLIENT_SIGNATURE_ALGORITHM
                        )
                    )
                    val signature = mac.doFinal(hash)

                    val uuid = UUID.randomUUID().toString()

                    intent = intent.setAction(SIGN_CHALLENGE_OPERATION).setFlags(0).addFlags(
                        Intent.FLAG_ACTIVITY_SINGLE_TOP
                    ).putExtra(
                        EXTRA_CHALLENGE_FIELD,
                        this.challenge
                    ).putExtra(EXTRA_SERVICE_FIELD, EXTRA_SERVICE_VALUE)
                        .putExtra(EXTRA_CLIENT_ID_FIELD, EXTRA_CLIENT_ID_VALUE.toInt())
                        .putExtra(EXTRA_SIGNATURE_FIELD, signature)
                        .putExtra(EXTRA_LOGO_FIELD, LOGO)
                        .putExtra(EXTRA_REQUEST_ID_FIELD, uuid)
                    if (EXTRA_USER_CODE_VALUE.trim().isNotEmpty()) {
                        intent.putExtra(EXTRA_USER_CODE_FIELD, EXTRA_USER_CODE_VALUE)
                    }
                } catch (e: NoSuchAlgorithmException) {
                    throw RuntimeException(e)
                } catch (e: IOException) {
                    throw RuntimeException(e)
                } catch (e: InvalidKeyException) {
                    throw RuntimeException(e)
                }
            }
            if (intent != null) {
                signChallengeActivityResultLauncher!!.launch(intent)
            }

        } catch (e: Exception) {

            Log.e("signChallenge exception", e.toString())
        }
    }
}
