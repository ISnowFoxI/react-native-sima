///
/// Func_void_std__exception_ptr.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/**
 * Wraps a Swift `(_ error: Error) -> Void` as a class.
 * This class can be used from C++, e.g. to wrap the Swift closure as a `std::function`.
 */
public final class Func_void_std__exception_ptr {
  public typealias bridge = margelo.nitro.sima.bridge.swift

  private let closure: (_ error: Error) -> Void

  public init(_ closure: @escaping (_ error: Error) -> Void) {
    self.closure = closure
  }

  @inline(__always)
  public func call(error: std.exception_ptr) -> Void {
    self.closure(RuntimeError.from(cppError: error))
  }

  /**
   * Casts this instance to a retained unsafe raw pointer.
   * This acquires one additional strong reference on the object!
   */
  @inline(__always)
  public func toUnsafe() -> UnsafeMutableRawPointer {
    return Unmanaged.passRetained(self).toOpaque()
  }

  /**
   * Casts an unsafe pointer to a `Func_void_std__exception_ptr`.
   * The pointer has to be a retained opaque `Unmanaged<Func_void_std__exception_ptr>`.
   * This removes one strong reference from the object!
   */
  @inline(__always)
  public static func fromUnsafe(_ pointer: UnsafeMutableRawPointer) -> Func_void_std__exception_ptr {
    return Unmanaged<Func_void_std__exception_ptr>.fromOpaque(pointer).takeRetainedValue()
  }
}
