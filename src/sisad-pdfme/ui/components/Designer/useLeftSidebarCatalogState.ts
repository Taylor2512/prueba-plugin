import { useCallback, useEffect, useState } from 'react';
import { getCustomSchemaDefinitions, subscribeCustomSchemaDefinitions } from './schemaRegistry.js';
import type { CatalogCapability, CatalogQuickFilter, CatalogViewMode } from './LeftSidebar.js';
import type { LeftSidebarTab } from './LeftSidebarTabs.js';
import type { RuntimeCustomSchemaDefinition } from './LeftSidebarCustomPanel.js';
import type { CustomFieldDef } from './LeftSidebarCustomFieldModal.js';

const makeDefaultCustomField = (): CustomFieldDef => ({
  id: `custom-${Date.now()}`,
  name: '',
  type: 'text',
  initialValue: '',
  required: false,
  readOnly: false,
  shared: false,
  collaborative: false,
  font: '__DEFAULT__',
  fontColor: '__DEFAULT__',
  fontSize: '__DEFAULT__',
  bold: false,
  italic: false,
  underline: false,
  fixedWidth: false,
  maskAsterisks: false,
  width: '',
  height: '',
  maxChars: '',
  validation: 'None',
  helpText: '',
  autoPlaceText: '',
});

type UseLeftSidebarCatalogStateArgs = {
  catalogViewMode?: CatalogViewMode;
};

const useLeftSidebarCatalogState = ({ catalogViewMode }: UseLeftSidebarCatalogStateArgs = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<LeftSidebarTab>('standard');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customDraft, setCustomDraft] = useState<CustomFieldDef>(() => makeDefaultCustomField());
  const [runtimeCustomDefinitions, setRuntimeCustomDefinitions] = useState<RuntimeCustomSchemaDefinition[]>(
    () => getCustomSchemaDefinitions() as RuntimeCustomSchemaDefinition[],
  );
  const [favoritePlugins, setFavoritePlugins] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = window.localStorage.getItem('sisad-pdfme:fav-plugins');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [recentPlugins, setRecentPlugins] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('sisad-pdfme:recent-plugins');
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
      return [];
    }
  });
  const [quickFilter, setQuickFilter] = useState<CatalogQuickFilter>('all');
  const [activeCapabilities, setActiveCapabilities] = useState<Set<CatalogCapability>>(new Set());
  const [internalViewMode, setInternalViewMode] = useState<CatalogViewMode>(catalogViewMode || 'compact');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => subscribeCustomSchemaDefinitions(() => {
    setRuntimeCustomDefinitions(getCustomSchemaDefinitions() as RuntimeCustomSchemaDefinition[]);
  }), []);

  useEffect(() => {
    if (catalogViewMode) {
      setInternalViewMode(catalogViewMode);
    }
  }, [catalogViewMode]);

  const resolvedViewMode = catalogViewMode || internalViewMode;

  const saveRecentPlugins = useCallback((next: string[]) => {
    const normalized = next.filter(Boolean).slice(0, 8);
    setRecentPlugins(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sisad-pdfme:recent-plugins', JSON.stringify(normalized));
    }
  }, []);

  const markRecent = useCallback(
    (pluginType: string) => {
      const normalized = String(pluginType || '').trim();
      if (!normalized) return;
      setRecentPlugins((prev) => {
        const next = [normalized, ...prev.filter((type) => type !== normalized)];
        const trimmed = next.slice(0, 8);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('sisad-pdfme:recent-plugins', JSON.stringify(trimmed));
        }
        return trimmed;
      });
    },
    [],
  );

  return {
    isDragging,
    setIsDragging,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    customModalOpen,
    setCustomModalOpen,
    customDraft,
    setCustomDraft,
    runtimeCustomDefinitions,
    setRuntimeCustomDefinitions,
    favoritePlugins,
    setFavoritePlugins,
    recentPlugins,
    setRecentPlugins,
    quickFilter,
    setQuickFilter,
    activeCapabilities,
    setActiveCapabilities,
    internalViewMode,
    setInternalViewMode,
    resolvedViewMode,
    collapsedCategories,
    setCollapsedCategories,
    saveRecentPlugins,
    markRecent,
  };
};

export default useLeftSidebarCatalogState;
