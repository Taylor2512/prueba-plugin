import { useCallback, useEffect, useState } from 'react';
import { getCustomSchemaDefinitions, subscribeCustomSchemaDefinitions } from '@sisad-pdfme/ui/components/Designer/schemaRegistry';
import type { CatalogCapability, CatalogQuickFilter, CatalogLayout } from '@sisad-pdfme/ui/components/Designer/LeftSidebar';
import type { LeftSidebarTab } from '@sisad-pdfme/ui/components/Designer/LeftSidebarTabs';
import type { RuntimeCustomSchemaDefinition } from '@sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel';
import type { CustomFieldDef } from '@sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal';

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
  options: '',
});

type UseLeftSidebarCatalogStateArgs = {
  catalogLayout?: CatalogLayout;
};

const useLeftSidebarCatalogState = ({ catalogLayout }: UseLeftSidebarCatalogStateArgs = {}) => {
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
  const [internalLayout, setInternalLayout] = useState<CatalogLayout>(catalogLayout || 'list');
  const [hasManualLayout, setHasManualLayout] = useState(false);
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
    if (catalogLayout !== undefined) {
      setInternalLayout(catalogLayout);
      setHasManualLayout(false);
    }
  }, [catalogLayout]);

  const setUserLayout = useCallback((layout: CatalogLayout) => {
    setHasManualLayout(true);
    setInternalLayout(layout);
  }, []);

  const resolvedLayout = hasManualLayout ? internalLayout : (catalogLayout ?? internalLayout);

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
    internalLayout,
    setInternalLayout,
    setUserLayout,
    resolvedLayout,
    collapsedCategories,
    setCollapsedCategories,
    hasManualLayout,
    saveRecentPlugins,
    markRecent,
  };
};

export default useLeftSidebarCatalogState;
