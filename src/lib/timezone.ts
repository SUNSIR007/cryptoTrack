// 时区管理系统

export interface Timezone {
  id: string;
  name: string;
  offset: string;
  city: string;
}

export const timezones: Timezone[] = [
  {
    id: 'Asia/Shanghai',
    name: '中国标准时间',
    offset: 'UTC+8',
    city: '北京'
  },
  {
    id: 'America/New_York',
    name: '美国东部时间',
    offset: 'UTC-5/-4',
    city: '纽约'
  },
  {
    id: 'America/Los_Angeles',
    name: '美国西部时间',
    offset: 'UTC-8/-7',
    city: '洛杉矶'
  },
  {
    id: 'Europe/London',
    name: '格林威治时间',
    offset: 'UTC+0/+1',
    city: '伦敦'
  },
  {
    id: 'Europe/Paris',
    name: '中欧时间',
    offset: 'UTC+1/+2',
    city: '巴黎'
  },
  {
    id: 'Asia/Tokyo',
    name: '日本标准时间',
    offset: 'UTC+9',
    city: '东京'
  },
  {
    id: 'Asia/Seoul',
    name: '韩国标准时间',
    offset: 'UTC+9',
    city: '首尔'
  },
  {
    id: 'Asia/Singapore',
    name: '新加坡时间',
    offset: 'UTC+8',
    city: '新加坡'
  },
  {
    id: 'Australia/Sydney',
    name: '澳大利亚东部时间',
    offset: 'UTC+10/+11',
    city: '悉尼'
  },
  {
    id: 'Asia/Dubai',
    name: '阿联酋时间',
    offset: 'UTC+4',
    city: '迪拜'
  }
];

// 时区管理器
class TimezoneManager {
  private currentTimezone: Timezone;
  private listeners: ((timezone: Timezone) => void)[] = [];

  constructor() {
    // 默认使用系统时区
    this.currentTimezone = this.detectSystemTimezone();
    this.loadTimezone();
  }

  // 检测系统时区
  private detectSystemTimezone(): Timezone {
    if (typeof window !== 'undefined') {
      try {
        const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const found = timezones.find(tz => tz.id === systemTimezone);
        if (found) {
          return found;
        }
      } catch (error) {
        console.warn('无法检测系统时区:', error);
      }
    }
    
    // 默认返回中国时区
    return timezones[0];
  }

  // 加载保存的时区设置
  private loadTimezone() {
    if (typeof window !== 'undefined') {
      const savedTimezoneId = localStorage.getItem('cryptotrack-timezone');
      if (savedTimezoneId) {
        const timezone = timezones.find(tz => tz.id === savedTimezoneId);
        if (timezone) {
          this.currentTimezone = timezone;
        }
      }
    }
  }

  // 设置时区
  setTimezone(timezoneId: string) {
    const timezone = timezones.find(tz => tz.id === timezoneId);
    if (timezone) {
      this.currentTimezone = timezone;
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cryptotrack-timezone', timezoneId);
      }

      // 通知监听器
      this.listeners.forEach(listener => listener(timezone));
    }
  }

  // 获取当前时区
  getCurrentTimezone(): Timezone {
    return this.currentTimezone;
  }

  // 获取所有时区
  getAllTimezones(): Timezone[] {
    return timezones;
  }

  // 添加时区变更监听器
  addListener(listener: (timezone: Timezone) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 格式化时间
  formatTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = new Date(date);
    const timezone = this.currentTimezone;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone.id,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const formatOptions = { ...defaultOptions, ...options };

    try {
      return new Intl.DateTimeFormat('zh-CN', formatOptions).format(dateObj);
    } catch (error) {
      console.warn('时间格式化失败:', error);
      return dateObj.toLocaleString('zh-CN');
    }
  }

  // 格式化相对时间
  formatRelativeTime(date: Date | string | number): string {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return this.formatTime(dateObj, {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // 获取当前时间
  getCurrentTime(): string {
    return this.formatTime(new Date());
  }
}

export const timezoneManager = new TimezoneManager();
