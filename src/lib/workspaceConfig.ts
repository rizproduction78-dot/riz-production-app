/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SISTEM WORKSPACE & ISOLASI LINGKUNGAN OPERASIONAL RESMI
 * PT. RIZ PRODUCTION MULTI KREASI
 * 
 * Fitur Utama:
 * 1. Dedicated Workspace Management:
 *    - Identifikasi unik Workspace ID, Nama Organisasi, Domain Operasional.
 *    - Prefiks penyimpanan lokal & cloud tersandi untuk mencegah tumpang tindih data.
 * 2. Multi-Environment Separation:
 *    - Default: "production" (PT. Riz Production Multi Kreasi - Live Operational)
 *    - Dapat beralih ke "staging" atau "sandbox" untuk simulasi pelatihan kru tanpa merusak data live.
 * 3. Health & Integrity Tracker:
 *    - Memantau kapasitas penyimpanan workspace, status sync, dan metadata lisensi.
 */

export interface AppWorkspace {
  id: string;
  name: string;
  code: string;
  description: string;
  organization: string;
  environment: 'production' | 'staging' | 'sandbox';
  isDefault: boolean;
  storagePrefix: string;
  createdAt: string;
  lastActiveAt: string;
  metadata: {
    divisions: string[];
    directorName: string;
    version: string;
    supportContact: string;
  };
}

export const OFFICIAL_WORKSPACES: AppWorkspace[] = [
  {
    id: 'ws-riz-production-main',
    name: 'PT. Riz Production Multi Kreasi (Primary Live)',
    code: 'RIZ-PROD',
    description: 'Workspace operasional utama untuk seluruh divisi (Audio, Lighting, Videotron, Multimedia, Gudang, Service, Admin).',
    organization: 'PT. Riz Production Multi Kreasi',
    environment: 'production',
    isDefault: true,
    storagePrefix: 'riz_',
    createdAt: '2026-09-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    metadata: {
      divisions: ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang', 'Service', 'Admin'],
      directorName: 'Wahyu',
      version: '2.0.0-PROD',
      supportContact: '081291225933'
    }
  },
  {
    id: 'ws-riz-staging-event',
    name: 'Event Staging & Simulation Sandbox',
    code: 'RIZ-STAGE',
    description: 'Workspace isolasi untuk gladi resik, simulasi timeline event besar, dan pelatihan teknisi.',
    organization: 'PT. Riz Production Multi Kreasi',
    environment: 'staging',
    isDefault: false,
    storagePrefix: 'riz_stage_',
    createdAt: '2026-09-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    metadata: {
      divisions: ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang', 'Service', 'Admin'],
      directorName: 'Wahyu',
      version: '2.0.0-STAGE',
      supportContact: '081291225933'
    }
  }
];

const WORKSPACE_STORAGE_KEY = 'riz_current_workspace_id';
const WORKSPACES_REGISTRY_KEY = 'riz_workspaces_registry';

class WorkspaceManager {
  private activeWorkspace: AppWorkspace;
  private allWorkspaces: AppWorkspace[] = [];

  constructor() {
    this.activeWorkspace = OFFICIAL_WORKSPACES[0];
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.allWorkspaces = [...OFFICIAL_WORKSPACES];
      return;
    }

    try {
      const savedList = localStorage.getItem(WORKSPACES_REGISTRY_KEY);
      if (savedList) {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.allWorkspaces = parsed;
        } else {
          this.allWorkspaces = [...OFFICIAL_WORKSPACES];
          this.persistRegistry();
        }
      } else {
        this.allWorkspaces = [...OFFICIAL_WORKSPACES];
        this.persistRegistry();
      }

      const activeId = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (activeId) {
        const found = this.allWorkspaces.find(w => w.id === activeId);
        if (found) {
          this.activeWorkspace = found;
        }
      }
    } catch (e) {
      console.warn('[Workspace] Failed to init workspace manager:', e);
      this.allWorkspaces = [...OFFICIAL_WORKSPACES];
      this.activeWorkspace = OFFICIAL_WORKSPACES[0];
    }
  }

  public getActiveWorkspace(): AppWorkspace {
    return this.activeWorkspace;
  }

  public getAllWorkspaces(): AppWorkspace[] {
    return this.allWorkspaces;
  }

  public switchWorkspace(workspaceId: string): boolean {
    const target = this.allWorkspaces.find(w => w.id === workspaceId);
    if (!target) return false;

    this.activeWorkspace = {
      ...target,
      lastActiveAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(WORKSPACE_STORAGE_KEY, target.id);
      } catch (e) {}
    }

    this.persistRegistry();
    return true;
  }

  public createWorkspace(params: {
    name: string;
    code: string;
    description: string;
    environment: 'production' | 'staging' | 'sandbox';
  }): AppWorkspace {
    const slug = params.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newWs: AppWorkspace = {
      id: `ws-${slug}-${Date.now()}`,
      name: params.name,
      code: params.code.toUpperCase(),
      description: params.description,
      organization: 'PT. Riz Production Multi Kreasi',
      environment: params.environment,
      isDefault: false,
      storagePrefix: `riz_${slug}_`,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      metadata: {
        divisions: ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang', 'Service', 'Admin'],
        directorName: 'Wahyu',
        version: '2.0.0',
        supportContact: '081291225933'
      }
    };

    this.allWorkspaces.push(newWs);
    this.persistRegistry();
    return newWs;
  }

  public getWorkspaceStorageKey(baseKey: string): string {
    if (this.activeWorkspace.isDefault) {
      return baseKey;
    }
    return `${this.activeWorkspace.storagePrefix}${baseKey.replace(/^riz_/, '')}`;
  }

  private persistRegistry() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(WORKSPACES_REGISTRY_KEY, JSON.stringify(this.allWorkspaces));
      } catch (e) {}
    }
  }

  public getStats() {
    return {
      activeWorkspaceName: this.activeWorkspace.name,
      activeWorkspaceCode: this.activeWorkspace.code,
      environment: this.activeWorkspace.environment,
      totalWorkspaces: this.allWorkspaces.length,
      storagePrefix: this.activeWorkspace.storagePrefix
    };
  }
}

export const workspaceManager = new WorkspaceManager();
