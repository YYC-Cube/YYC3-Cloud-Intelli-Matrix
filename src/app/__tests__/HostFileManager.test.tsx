// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { HostFileManager } from "../components/HostFileManager";

vi.mock("../hooks/useHostFileSystem", () => ({
  useHostFileSystem: vi.fn(() => ({
    entries: [],
    currentPath: "/",
    editingFile: null,
    editingContent: "",
    editingDirty: false,
    recentFiles: [],
    currentFileVersions: [],
    searchResults: [],
    searching: false,
    openDirectory: vi.fn(),
    navigateTo: vi.fn(),
    createFile: vi.fn(),
    createDirectory: vi.fn(),
    deleteEntry: vi.fn(),
    renameEntry: vi.fn(),
    openFile: vi.fn(),
    saveFile: vi.fn(),
    closeEditor: vi.fn(),
    uploadFiles: vi.fn(),
    searchFiles: vi.fn(),
    restoreVersion: vi.fn(),
    deleteVersion: vi.fn(),
  })),
  getFileTypeInfo: vi.fn(() => ({
    icon: "File",
    color: "#00d4ff",
  })),
}));

vi.mock("./CodeEditor", () => ({
  CodeEditor: ({ value, onChange }: any) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  ),
  getLanguageLabel: vi.fn(() => "JavaScript"),
}));

vi.mock("../lib/view-context", () => ({
  ViewContext: React.createContext({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

describe("HostFileManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render host file manager page", () => {
    render(React.createElement(HostFileManager));
    expect(screen.getByText("宿主机文件系统")).toBeInTheDocument();
  });

  it("should render tabs", () => {
    render(React.createElement(HostFileManager));
    expect(screen.getByText("文件浏览")).toBeInTheDocument();
    expect(screen.getByText("编辑器")).toBeInTheDocument();
    expect(screen.getByText("版本历史")).toBeInTheDocument();
    expect(screen.getByText("最近文件")).toBeInTheDocument();
  });

  it("should render open directory button", () => {
    render(React.createElement(HostFileManager));
    const openButtons = screen.getAllByText("打开目录");
    expect(openButtons.length).toBeGreaterThan(0);
  });

  it("should render create file button", () => {
    render(React.createElement(HostFileManager));
    const createButtons = screen.getAllByText("新建文件");
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it("should render create directory button", () => {
    render(React.createElement(HostFileManager));
    const createDirButtons = screen.getAllByText("新建目录");
    expect(createDirButtons.length).toBeGreaterThan(0);
  });

  it("should render upload button", () => {
    render(React.createElement(HostFileManager));
    const uploadButtons = screen.getAllByText("上传文件");
    expect(uploadButtons.length).toBeGreaterThan(0);
  });
});
