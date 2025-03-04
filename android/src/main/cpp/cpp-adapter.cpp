#include <jni.h>
#include "SimaOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::sima::initialize(vm);
}
