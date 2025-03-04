package com.sima

import android.content.Intent
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.sima.HybridSimaSpec
import com.margelo.nitro.sima.SimaData
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

class SimaException(message: String) : Exception(message)

class HybridSima: HybridSimaSpec() {

    override fun startSimaAuth(data: SimaData): Promise<String> {
        val currentPromise = Promise<String>()
        var applicationContext = NitroModules.applicationContext
        if (applicationContext == null) {
            currentPromise.reject(Throwable("Application context is null"))
            return   currentPromise
        }
        val requestId = UUID.randomUUID().toString()
        promiseMap[requestId] = currentPromise
        val intent = Intent(applicationContext, SimaActivity::class.java)
        intent.putExtra(EXTRA_SERVICE_FIELD, data.serviceName)
        intent.putExtra(EXTRA_USER_CODE_FIELD, data.userPinCode)
        intent.putExtra(EXTRA_LOGO_FIELD, data.logo)
        intent.putExtra(CLIENT_MASTER_KEY_FIELD, data.masterKey)
        intent.putExtra(EXTRA_CLIENT_ID_FIELD, data.clientId)
        intent.putExtra("request_id", requestId)
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

        applicationContext.startActivity(intent)

         return  currentPromise
    }

    companion object {
        val promiseMap: ConcurrentHashMap<String, Promise<String>> = ConcurrentHashMap()
        var EXTRA_CLIENT_ID_FIELD: String = "client_id"
        var EXTRA_SERVICE_FIELD: String = "service_name"
        var CLIENT_MASTER_KEY_FIELD: String = "master_key"
        var EXTRA_USER_CODE_FIELD: String = "user_code"
        var EXTRA_LOGO_FIELD: String = "service_logo"
    }
}
