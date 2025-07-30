import { useCallback, useMemo, useRef } from 'react';

// 防抖Hook
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// 节流Hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

// 记忆化计算Hook
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: any[]
): T {
  return useMemo(calculation, dependencies);
}

// 性能监控Hook
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  renderCount.current += 1;

  const logPerformance = useCallback(() => {
    const renderTime = Date.now() - renderStartTime.current;
    console.log(`[Performance] ${componentName} - Render #${renderCount.current} took ${renderTime}ms`);
  }, [componentName]);

  // 在开发环境下记录性能
  if (process.env.NODE_ENV === 'development') {
    setTimeout(logPerformance, 0);
  }

  renderStartTime.current = Date.now();
}

// 虚拟化Hook（用于大列表）
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number = 0
) {
  return useMemo(() => {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItemCount + 1, itemCount);
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex,
      visibleItems: endIndex - Math.max(0, startIndex),
      totalHeight: itemCount * itemHeight,
      offsetY: Math.max(0, startIndex) * itemHeight
    };
  }, [itemCount, itemHeight, containerHeight, scrollTop]);
}
