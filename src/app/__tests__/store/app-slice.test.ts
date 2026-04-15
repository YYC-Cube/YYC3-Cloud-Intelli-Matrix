/**
 * @file: app-slice.test.ts
 * @description: YYC³ App Slice 单元测试 · 用户认证/UI/告警/性能指标
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-16
 * @updated: 2026-04-16
 * @status: active
 * @tags: [auto-generated]
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAppSlice } from '../../store/slices/app-slice';
import type { AppUser, AlertData, Locale } from '../../types';
import type { RecentOpEntry } from '../../store/slices/app-slice';
import type { UserRole } from '../../types';

describe('useAppSlice', () => {
  const mockUser: AppUser = {
    id: 'user-001',
    email: 'admin@yyc3.com',
    name: 'Admin User',
    role: 'admin' as UserRole,
  };

  const mockAlert: AlertData = {
    id: 'alert-001',
    level: 'warning' as any,
    message: 'This is a test alert',
    source: 'test',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    useAppSlice.getState().logout();
    useAppSlice.getState().clearAlerts();
    useAppSlice.getState().clearRecentOps();
    // 重置 UI 状态到默认值
    useAppSlice.getState().setTheme('cyberpunk');
    useAppSlice.getState().setLocale('zh-CN' as Locale);
    if (useAppSlice.getState().sidebarCollapsed) {
      useAppSlice.getState().toggleSidebar();
    }
    useAppSlice.getState().setCommandPaletteOpen(false);
  });

  describe('初始状态', () => {
    it('user 应该为 null', () => {
      expect(useAppSlice.getState().user).toBeNull();
    });

    it('token 应该为 null', () => {
      expect(useAppSlice.getState().token).toBeNull();
    });

    it('isGhost 应该为 false', () => {
      expect(useAppSlice.getState().isGhost).toBe(false);
    });

    it('theme 默认值应该是 cyberpunk', () => {
      expect(useAppSlice.getState().theme).toBe('cyberpunk');
    });

    it('locale 默认值应该是 zh-CN', () => {
      expect(useAppSlice.getState().locale).toBe('zh-CN');
    });

    it('sidebarCollapsed 默认值应该是 false', () => {
      expect(useAppSlice.getState().sidebarCollapsed).toBe(false);
    });

    it('commandPaletteOpen 默认值应该是 false', () => {
      expect(useAppSlice.getState().commandPaletteOpen).toBe(false);
    });

    it('alerts 默认应该为空数组', () => {
      expect(useAppSlice.getState().alerts).toHaveLength(0);
    });

    it('maxAlerts 应该是 100', () => {
      expect(useAppSlice.getState().maxAlerts).toBe(100);
    });

    it('fps 默认值应该是 60', () => {
      expect(useAppSlice.getState().fps).toBe(60);
    });

    it('memoryUsage 默认值应该是 0', () => {
      expect(useAppSlice.getState().memoryUsage).toBe(0);
    });
  });

  describe('用户认证方法', () => {
    describe('setUser', () => {
      it('应该设置用户信息', () => {
        useAppSlice.getState().setUser(mockUser);

        expect(useAppSlice.getState().user).toEqual(mockUser);
        expect(useAppSlice.getState().user?.email).toBe('admin@yyc3.com');
      });

      it('应该支持设置为 null（登出场景）', () => {
        useAppSlice.getState().setUser(mockUser);
        useAppSlice.getState().setUser(null);

        expect(useAppSlice.getState().user).toBeNull();
      });
    });

    describe('setToken', () => {
      it('应该设置令牌', () => {
        useAppSlice.getState().setToken('test-token-123');

        expect(useAppSlice.getState().token).toBe('test-token-123');
      });

      it('应该支持清除令牌', () => {
        useAppSlice.getState().setToken('some-token');
        useAppSlice.getState().setToken(null);

        expect(useAppSlice.getState().token).toBeNull();
      });
    });

    describe('setIsGhost', () => {
      it('应该启用幽灵模式', () => {
        useAppSlice.getState().setIsGhost(true);

        expect(useAppSlice.getState().isGhost).toBe(true);
      });

      it('应该禁用幽灵模式', () => {
        useAppSlice.getState().setIsGhost(true);
        useAppSlice.getState().setIsGhost(false);

        expect(useAppSlice.getState().isGhost).toBe(false);
      });
    });

    describe('logout', () => {
      it('应该清除所有认证信息', () => {
        // 先设置完整状态
        useAppSlice.getState().setUser(mockUser);
        useAppSlice.getState().setToken('valid-token');
        useAppSlice.getState().setIsGhost(true);

        // 执行登出
        useAppSlice.getState().logout();

        // 验证全部清除
        expect(useAppSlice.getState().user).toBeNull();
        expect(useAppSlice.getState().token).toBeNull();
        expect(useAppSlice.getState().isGhost).toBe(false);
      });

      it('重复登出不应该报错', () => {
        expect(() => {
          useAppSlice.getState().logout();
          useAppSlice.getState().logout();
        }).not.toThrow();
      });
    });
  });

  describe('UI 设置方法', () => {
    describe('setTheme', () => {
      it('应该支持 light 主题', () => {
        useAppSlice.getState().setTheme('light');
        expect(useAppSlice.getState().theme).toBe('light');
      });

      it('应该支持 dark 主题', () => {
        useAppSlice.getState().setTheme('dark');
        expect(useAppSlice.getState().theme).toBe('dark');
      });

      it('应该支持 cyberpunk 主题', () => {
        useAppSlice.getState().setTheme('cyberpunk');
        expect(useAppSlice.getState().theme).toBe('cyberpunk');
      });
    });

    describe('setLocale', () => {
      it('应该支持中文', () => {
        useAppSlice.getState().setLocale('zh-CN' as Locale);
        expect(useAppSlice.getState().locale).toBe('zh-CN');
      });

      it('应该支持英文', () => {
        useAppSlice.getState().setLocale('en-US' as Locale);
        expect(useAppSlice.getState().locale).toBe('en-US');
      });
    });

    describe('toggleSidebar', () => {
      it('应该切换侧边栏状态（false → true）', () => {
        useAppSlice.getState().toggleSidebar();
        expect(useAppSlice.getState().sidebarCollapsed).toBe(true);
      });

      it('应该切换侧边栏状态（true → false）', () => {
        useAppSlice.getState().toggleSidebar(); // true
        useAppSlice.getState().toggleSidebar(); // false
        expect(useAppSlice.getState().sidebarCollapsed).toBe(false);
      });

      it('多次切换应该正常工作', () => {
        const states = [true, false, true, false, true];
        states.forEach(expected => {
          useAppSlice.getState().toggleSidebar();
          expect(useAppSlice.getState().sidebarCollapsed).toBe(expected);
        });
      });
    });

    describe('setCommandPaletteOpen', () => {
      it('应该打开命令面板', () => {
        useAppSlice.getState().setCommandPaletteOpen(true);
        expect(useAppSlice.getState().commandPaletteOpen).toBe(true);
      });

      it('应该关闭命令面板', () => {
        useAppSlice.getState().setCommandPaletteOpen(true);
        useAppSlice.getState().setCommandPaletteOpen(false);
        expect(useAppSlice.getState().commandPaletteOpen).toBe(false);
      });
    });
  });

  describe('告警管理', () => {
    describe('addAlert', () => {
      it('应该添加告警到列表头部', () => {
        useAppSlice.getState().addAlert(mockAlert);

        const { alerts } = useAppSlice.getState();
        expect(alerts).toHaveLength(1);
        expect(alerts[0].id).toBe('alert-001');
      });

      it('新告警应该在列表最前面', () => {
        const alert2: AlertData = {
          ...mockAlert,
          id: 'alert-002',
        };

        useAppSlice.getState().addAlert(mockAlert);
        useAppSlice.getState().addAlert(alert2);

        const { alerts } = useAppSlice.getState();
        expect(alerts[0].id).toBe('alert-002');
        expect(alerts[1].id).toBe('alert-001');
      });

      it('告警数量不应该超过 maxAlerts', () => {
        // 添加超过 maxAlerts 的告警
        for (let i = 0; i < 110; i++) {
          useAppSlice.getState().addAlert({
            ...mockAlert,
            id: `alert-${i}`,
          });
        }

        const { alerts, maxAlerts } = useAppSlice.getState();
        expect(alerts.length).toBeLessThanOrEqual(maxAlerts);
        expect(alerts.length).toBe(100); // maxAlerts 的值
      });
    });

    describe('removeAlert', () => {
      it('应该删除指定 ID 的告警', () => {
        useAppSlice.getState().addAlert(mockAlert);

        useAppSlice.getState().removeAlert('alert-001');

        expect(useAppSlice.getState().alerts).toHaveLength(0);
      });

      it('删除不存在的 ID 不应影响其他告警', () => {
        useAppSlice.getState().addAlert(mockAlert);

        useAppSlice.getState().removeAlert('non-existent');

        expect(useAppSlice.getState().alerts).toHaveLength(1);
      });
    });

    describe('clearAlerts', () => {
      it('应该清空所有告警', () => {
        for (let i = 0; i < 5; i++) {
          useAppSlice.getState().addAlert({
            ...mockAlert,
            id: `alert-${i}`,
          });
        }

        useAppSlice.getState().clearAlerts();

        expect(useAppSlice.getState().alerts).toHaveLength(0);
      });

      it('清空空列表不应该报错', () => {
        expect(() => {
          useAppSlice.getState().clearAlerts();
        }).not.toThrow();
      });
    });
  });

  describe('性能指标', () => {
    describe('setFps', () => {
      it('应该设置帧率', () => {
        useAppSlice.getState().setFps(120);
        expect(useAppSlice.getState().fps).toBe(120);
      });

      it('应该支持低帧率', () => {
        useAppSlice.getState().setFps(15);
        expect(useAppSlice.getState().fps).toBe(15);
      });

      it('应该支持帧率为 0', () => {
        useAppSlice.getState().setFps(0);
        expect(useAppSlice.getState().fps).toBe(0);
      });
    });

    describe('setMemoryUsage', () => {
      it('应该设置内存使用量', () => {
        useAppSlice.getState().setMemoryUsage(75.5);
        expect(useAppSlice.getState().memoryUsage).toBeCloseTo(75.5, 1);
      });

      it('应该支持高内存使用率', () => {
        useAppSlice.getState().setMemoryUsage(98.7);
        expect(useAppSlice.getState().memoryUsage).toBeCloseTo(98.7, 1);
      });

      it('应该支持 0 内存使用', () => {
        useAppSlice.getState().setMemoryUsage(0);
        expect(useAppSlice.getState().memoryUsage).toBe(0);
      });
    });
  });

  describe('最近操作', () => {
    describe('addRecentOp', () => {
      it('应该添加操作记录到列表头部', () => {
        const op: RecentOpEntry = {
          id: 'OP-new',
          action: '测试操作',
          target: '测试目标',
          user: 'test-user',
          time: '00:00:00',
          status: 'success',
        };

        useAppSlice.getState().addRecentOp(op);

        const { recentOps } = useAppSlice.getState();
        expect(recentOps[0].id).toBe('OP-new');
      });

      it('新操作应该在列表最前面', () => {
        const op1: RecentOpEntry = {
          id: 'OP-1',
          action: '操作1',
          target: '目标1',
          user: 'user1',
          time: '00:01:00',
          status: 'success',
        };
        const op2: RecentOpEntry = {
          ...op1,
          id: 'OP-2',
          action: '操作2',
        };

        useAppSlice.getState().addRecentOp(op1);
        useAppSlice.getState().addRecentOp(op2);

        const { recentOps } = useAppSlice.getState();
        expect(recentOps[0].id).toBe('OP-2');
        expect(recentOps[1].id).toBe('OP-1');
      });

      it('操作记录数量不应超过 50 条', () => {
        for (let i = 0; i < 60; i++) {
          useAppSlice.getState().addRecentOp({
            id: `OP-batch-${i}`,
            action: `批量操作${i}`,
            target: `目标${i}`,
            user: 'system',
            time: `${String(i).padStart(2, '0')}:00:00`,
            status: 'success',
          });
        }

        const { recentOps } = useAppSlice.getState();
        expect(recentOps.length).toBe(50);
      });
    });

    describe('clearRecentOps', () => {
      it('应该清空所有操作记录', () => {
        useAppSlice.getState().addRecentOp({
          id: 'OP-temp',
          action: '临时操作',
          target: '临时目标',
          user: 'temp-user',
          time: '12:00:00',
          status: 'running',
        });

        useAppSlice.getState().clearRecentOps();

        expect(useAppSlice.getState().recentOps).toHaveLength(0);
      });
    });
  });

  describe('集成场景', () => {
    it('完整的登录流程', () => {
      // 1. 设置用户和令牌
      useAppSlice.getState().setUser(mockUser);
      useAppSlice.getState().setToken('auth-jwt-token');

      // 验证登录状态
      expect(useAppSlice.getState().user).toEqual(mockUser);
      expect(useAppSlice.getState().token).toBe('auth-jwt-token');

      // 2. 添加一条操作记录
      useAppSlice.getState().addRecentOp({
        id: 'OP-login',
        action: '用户登录',
        target: 'Web Console',
        user: mockUser.name,
        time: new Date().toTimeString().slice(0, 8),
        status: 'success',
      });

      expect(useAppSlice.getState().recentOps).toHaveLength(1);

      // 3. 登出
      useAppSlice.getState().logout();

      // 验证登出状态
      expect(useAppSlice.getState().user).toBeNull();
      expect(useAppSlice.getState().token).toBeNull();
    });

    it('告警处理流程', () => {
      // 1. 收到多个告警
      const warningAlert: AlertData = {
        ...mockAlert,
        id: 'warn-001',
        level: 'warning' as any,
        message: '温度警告',
      };
      const errorAlert: AlertData = {
        ...mockAlert,
        id: 'error-001',
        level: 'error' as any,
        message: '连接失败',
      };

      useAppSlice.getState().addAlert(warningAlert);
      useAppSlice.getState().addAlert(errorAlert);

      expect(useAppSlice.getState().alerts).toHaveLength(2);

      // 2. 处理第一个告警
      useAppSlice.getState().removeAlert('error-001');

      expect(useAppSlice.getState().alerts).toHaveLength(1);
      expect(useAppSlice.getState().alerts[0].level).toBe('warning');

      // 3. 清空所有告警
      useAppSlice.getState().clearAlerts();

      expect(useAppSlice.getState().alerts).toHaveLength(0);
    });

    it('主题和语言切换流程', () => {
      // 初始状态
      expect(useAppSlice.getState().theme).toBe('cyberpunk');
      expect(useAppSlice.getState().locale).toBe('zh-CN');

      // 切换到暗色主题 + 英文
      useAppSlice.getState().setTheme('dark');
      useAppSlice.getState().setLocale('en-US' as Locale);

      expect(useAppSlice.getState().theme).toBe('dark');
      expect(useAppSlice.getState().locale).toBe('en-US');

      // 打开命令面板
      useAppSlice.getState().setCommandPaletteOpen(true);
      expect(useAppSlice.getState().commandPaletteOpen).toBe(true);

      // 关闭命令面板
      useAppSlice.getState().setCommandPaletteOpen(false);
      expect(useAppSlice.getState().commandPaletteOpen).toBe(false);
    });
  });
});
