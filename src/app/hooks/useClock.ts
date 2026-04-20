/**
 * @file: useClock.ts
 * @description: 实时时钟 Hook — 每秒更新的 Date 对象
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-20
 * @updated: 2026-04-20
 * @status: active
 * @tags: [hook],[clock]
 */

import { useState, useEffect } from "react";

/** 每秒更新的实时时钟 */
export function useClock(): Date {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
