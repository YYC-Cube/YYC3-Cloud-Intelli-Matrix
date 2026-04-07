/**
 * FollowUpManager.tsx
 * ==================
 * 后续跟进任务管理器
 * 使用 dashboard-stores.ts 中的 followUpStore
 * 支持创建、编辑、删除、状态管理
 */

import React, { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle,
  Filter, Search, Calendar, User,
  Flag, ArrowUp, ArrowDown, RefreshCw,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useI18n } from "../hooks/useI18n";
import { followUpStore, type FollowUpRecord } from "../stores/dashboard-stores";
import { userStore } from "../stores/dashboard-stores";
import { FollowUpEditDialog } from "./FollowUpEditDialog";

export function FollowUpManager() {
  const { t: _t } = useI18n();
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState<FollowUpRecord[]>([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | FollowUpRecord["status"]>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | FollowUpRecord["priority"]>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [users, _setUsers] = useState(userStore.getAll());

  const loadFollowUps = () => {
    const allFollowUps = followUpStore.getAll();
    setFollowUps(allFollowUps);
    setFilteredFollowUps(allFollowUps);
  };

  const applyFilters = () => {
    let filtered = [...followUps];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (fu) =>
          fu.taskName.toLowerCase().includes(query) ||
          fu.notes?.toLowerCase().includes(query) ||
          fu.assigneeName.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((fu) => fu.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((fu) => fu.priority === filterPriority);
    }

    if (filterAssignee !== "all") {
      filtered = filtered.filter((fu) => fu.assignee === filterAssignee);
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "dueDate") {
        comparison = a.dueDate - b.dueDate;
      } else if (sortBy === "priority") {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "createdAt") {
        comparison = a.createdAt - b.createdAt;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredFollowUps(filtered);
  };

  useEffect(() => {
    loadFollowUps();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followUps, searchQuery, filterStatus, filterPriority, filterAssignee, sortBy, sortOrder]);

  const handleCreate = () => {
    setSelectedFollowUp(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (followUp: FollowUpRecord) => {
    setSelectedFollowUp(followUp);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除此跟进任务吗？")) {
      followUpStore.remove(id);
      loadFollowUps();
    }
  };

  const handleStatusChange = (id: string, status: FollowUpRecord["status"]) => {
    const followUp = followUps.find((fu) => fu.id === id);
    if (followUp) {
      const updates: Partial<FollowUpRecord> = { status, updatedAt: Date.now() };
      if (status === "completed") {
        updates.completedAt = Date.now();
      }
      followUpStore.update(id, updates);
      loadFollowUps();
    }
  };

  const handleSave = (followUp: FollowUpRecord) => {
    if (followUp.id) {
      followUpStore.update(followUp.id, followUp);
    } else {
      const newFollowUp: FollowUpRecord = {
        ...followUp,
        id: `fu-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      followUpStore.add(newFollowUp);
    }
    loadFollowUps();
    setIsEditDialogOpen(false);
    setSelectedFollowUp(null);
  };

  const getPriorityColor = (priority: FollowUpRecord["priority"]) => {
    const colors = {
      critical: "#ff3366",
      high: "#ff6600",
      medium: "#ffaa00",
      low: "#00d4ff",
    };
    return colors[priority];
  };

  const getStatusColor = (status: FollowUpRecord["status"]) => {
    const colors = {
      pending: "#ffaa00",
      in_progress: "#00d4ff",
      completed: "#00ff88",
      cancelled: "#666666",
    };
    return colors[status];
  };

  const getStatusIcon = (status: FollowUpRecord["status"]) => {
    const icons = {
      pending: Clock,
      in_progress: RefreshCw,
      completed: CheckCircle,
      cancelled: AlertCircle,
    };
    return icons[status];
  };

  const isOverdue = (dueDate: number, status: FollowUpRecord["status"]) => {
    return (status === "pending" || status === "in_progress") && dueDate < Date.now();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDue = (dueDate: number) => {
    const now = Date.now();
    const diff = dueDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const stats = {
    total: followUps.length,
    pending: followUps.filter((fu) => fu.status === "pending").length,
    inProgress: followUps.filter((fu) => fu.status === "in_progress").length,
    completed: followUps.filter((fu) => fu.status === "completed").length,
    overdue: followUps.filter((fu) => isOverdue(fu.dueDate, fu.status)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.1)] flex items-center justify-center">
            <Flag className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#e0f0ff]">后续跟进任务</h1>
            <p className="text-sm text-[rgba(0,212,255,0.5)]">
              管理和跟踪所有待处理的跟进任务
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-[#060e1f] rounded-lg font-medium hover:bg-[#00b8e6] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建任务
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="总数" value={stats.total} color="#00d4ff" />
        <StatCard label="待处理" value={stats.pending} color="#ffaa00" />
        <StatCard label="进行中" value={stats.inProgress} color="#00d4ff" />
        <StatCard label="已完成" value={stats.completed} color="#00ff88" />
        <StatCard label="已过期" value={stats.overdue} color="#ff3366" />
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,212,255,0.5)]" />
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-lg text-[#e0f0ff] placeholder-[rgba(0,212,255,0.4)] focus:outline-none focus:border-[#00d4ff]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[rgba(0,212,255,0.5)]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-lg text-[#e0f0ff] focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="all">所有状态</option>
              <option value="pending">待处理</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-2 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-lg text-[#e0f0ff] focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="all">所有优先级</option>
              <option value="critical">紧急</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-2 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-lg text-[#e0f0ff] focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="all">所有负责人</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-lg text-[#e0f0ff] focus:outline-none focus:border-[#00d4ff]"
            >
              <option value="dueDate">截止日期</option>
              <option value="priority">优先级</option>
              <option value="createdAt">创建时间</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-lg text-[#e0f0ff] hover:bg-[rgba(0,212,255,0.1)] transition-colors"
            >
              {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {filteredFollowUps.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Flag className="w-12 h-12 text-[rgba(0,212,255,0.3)] mx-auto mb-4" />
            <p className="text-[#e0f0ff] mb-2">暂无跟进任务</p>
            <p className="text-sm text-[rgba(0,212,255,0.5)]">
              点击&ldquo;新建任务&rdquo;创建第一个跟进任务
            </p>
          </GlassCard>
        ) : (
          filteredFollowUps.map((followUp) => {
            const StatusIcon = getStatusIcon(followUp.status);
            const daysUntilDue = getDaysUntilDue(followUp.dueDate);
            const overdue = isOverdue(followUp.dueDate, followUp.status);

            return (
              <GlassCard
                key={followUp.id}
                className={`p-4 ${overdue ? "border-l-4 border-l-[#ff3366]" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${getPriorityColor(followUp.priority)}20` }}
                  >
                    <Flag className="w-5 h-5" style={{ color: getPriorityColor(followUp.priority) }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#e0f0ff] mb-1">
                          {followUp.taskName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${getPriorityColor(followUp.priority)}20`,
                              color: getPriorityColor(followUp.priority),
                            }}
                          >
                            {followUp.priority}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                            style={{
                              backgroundColor: `${getStatusColor(followUp.status)}20`,
                              color: getStatusColor(followUp.status),
                            }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {followUp.status}
                          </span>
                          <span className="text-xs text-[rgba(0,212,255,0.5)]">
                            {followUp.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(followUp)}
                          className="p-2 hover:bg-[rgba(0,212,255,0.1)] rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4 text-[rgba(0,212,255,0.7)]" />
                        </button>
                        <button
                          onClick={() => handleDelete(followUp.id)}
                          className="p-2 hover:bg-[rgba(255,51,102,0.1)] rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4 text-[rgba(255,51,102,0.7)]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2 text-[rgba(0,212,255,0.7)]">
                        <User className="w-4 h-4" />
                        {followUp.assigneeName}
                      </div>
                      <div
                        className={`flex items-center gap-2 ${overdue ? "text-[#ff3366]" : "text-[rgba(0,212,255,0.7)]"}`}
                      >
                        <Calendar className="w-4 h-4" />
                        {overdue ? (
                          <span>已过期 {Math.abs(daysUntilDue)} 天</span>
                        ) : (
                          <span>剩余 {daysUntilDue} 天</span>
                        )}
                        <span className="text-xs opacity-70">
                          ({formatDate(followUp.dueDate)})
                        </span>
                      </div>
                    </div>

                    {followUp.notes && (
                      <p className="text-sm text-[rgba(0,212,255,0.6)] mb-3">
                        {followUp.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      {followUp.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(followUp.id, "in_progress")}
                          className="px-3 py-1.5 bg-[rgba(0,212,255,0.1)] text-[#00d4ff] rounded-lg text-sm hover:bg-[rgba(0,212,255,0.2)] transition-colors"
                        >
                          开始处理
                        </button>
                      )}
                      {followUp.status === "in_progress" && (
                        <button
                          onClick={() => handleStatusChange(followUp.id, "completed")}
                          className="px-3 py-1.5 bg-[rgba(0,255,136,0.1)] text-[#00ff88] rounded-lg text-sm hover:bg-[rgba(0,255,136,0.2)] transition-colors"
                        >
                          标记完成
                        </button>
                      )}
                      {followUp.status === "completed" && (
                        <button
                          onClick={() => handleStatusChange(followUp.id, "pending")}
                          className="px-3 py-1.5 bg-[rgba(255,170,0,0.1)] text-[#ffaa00] rounded-lg text-sm hover:bg-[rgba(255,170,0,0.2)] transition-colors"
                        >
                          重新打开
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      <FollowUpEditDialog
        isOpen={isEditDialogOpen}
        followUp={selectedFollowUp}
        users={users}
        onSave={handleSave}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedFollowUp(null);
        }}
      />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Flag className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs text-[rgba(0,212,255,0.5)] mb-1">{label}</p>
          <p className="text-2xl font-bold" style={{ color, fontFamily: "'Orbitron', sans-serif" }}>
            {value}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
