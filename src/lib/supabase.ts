import { createClient } from "@supabase/supabase-js";

// Check environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const isRealSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseUrl.includes("your-supabase")
);

export interface SupabasePost {
  id: string;
  user_id: string;
  current_step: number;
  news_url: string;
  manchete: string;
  subtitulo: string;
  legenda: string;
  image_url: string;
  pub_type: string;
  tone: string;
  quality: string;
  text_styles: any;
  preview_data: any;
  instagram_connected: boolean;
  whatsapp_connected: boolean;
  created_at: string;
  updated_at: string;
}

// LocalStorage based database for mock fallback to prevent crash whilst providing full API schema implementation
class LocalStorageSupabaseMock {
  private getStorage(): SupabasePost[] {
    const data = localStorage.getItem("supabase_posts_db");
    return data ? JSON.parse(data) : [];
  }

  private saveStorage(data: SupabasePost[]) {
    localStorage.setItem("supabase_posts_db", JSON.stringify(data));
  }

  from(table: string) {
    return {
      select: (columns = "*") => {
        const db = this.getStorage();
        return {
          eq: (column: string, value: any) => {
            const filtered = db.filter((r: any) => r[column] === value);
            return {
              single: async () => {
                const item = filtered[0] || null;
                return { data: item, error: null };
              },
              order: (by: string, { ascending = false } = {}) => {
                const sorted = [...filtered].sort((a: any, b: any) => {
                  const valA = a[by] ? new Date(a[by]).getTime() : 0;
                  const valB = b[by] ? new Date(b[by]).getTime() : 0;
                  return ascending ? valA - valB : valB - valA;
                });
                return {
                  limit: (num: number) => {
                    return {
                      single: async () => {
                        return { data: sorted[0] || null, error: null };
                      },
                      then: async (resolve: any) => {
                        resolve({ data: sorted.slice(0, num)[0] || null, error: null });
                      }
                    };
                  },
                  then: async (resolve: any) => {
                    resolve({ data: sorted, error: null });
                  }
                };
              },
              then: async (resolve: any) => {
                resolve({ data: filtered, error: null });
              }
            };
          },
          order: (by: string, { ascending = false } = {}) => {
            const sorted = [...db].sort((a: any, b: any) => {
              const valA = a[by] ? new Date(a[by]).getTime() : 0;
              const valB = b[by] ? new Date(b[by]).getTime() : 0;
              return ascending ? valA - valB : valB - valA;
            });
            return {
              limit: (num: number) => {
                return {
                  single: async () => {
                    return { data: sorted[0] || null, error: null };
                  },
                  then: async (resolve: any) => {
                    resolve({ data: sorted.slice(0, num), error: null });
                  }
                };
              },
              then: async (resolve: any) => {
                resolve({ data: sorted, error: null });
              }
            };
          },
          then: async (resolve: any) => {
            resolve({ data: db, error: null });
          }
        };
      },
      upsert: (values: any) => {
        const db = this.getStorage();
        const arrayValues = Array.isArray(values) ? values : [values];
        const updatedList = [...db];
        
        for (const val of arrayValues) {
          const idx = updatedList.findIndex(r => r.id === val.id);
          const payload = {
            ...val,
            updated_at: new Date().toISOString()
          };
          if (idx >= 0) {
            updatedList[idx] = { ...updatedList[idx], ...payload };
          } else {
            payload.created_at = new Date().toISOString();
            updatedList.push(payload);
          }
        }
        this.saveStorage(updatedList);
        
        return {
          select: () => {
            return {
              single: async () => {
                return { data: arrayValues[0], error: null };
              },
              then: async (resolve: any) => {
                resolve({ data: arrayValues, error: null });
              }
            };
          },
          then: async (resolve: any) => {
            resolve({ data: arrayValues, error: null });
          }
        };
      },
      insert: (values: any) => {
        const db = this.getStorage();
        const arrayValues = Array.isArray(values) ? values : [values];
        const inserted = [];
        
        for (const val of arrayValues) {
          const payload = {
            ...val,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          db.push(payload);
          inserted.push(payload);
        }
        this.saveStorage(db);
        
        return {
          select: () => {
            return {
              single: async () => {
                return { data: inserted[0], error: null };
              },
              then: async (resolve: any) => {
                resolve({ data: inserted, error: null });
              }
            };
          },
          then: async (resolve: any) => {
            resolve({ data: inserted, error: null });
          }
        };
      },
      update: (values: any) => {
        return {
          eq: (column: string, value: any) => {
            const db = this.getStorage();
            let updatedCount = 0;
            const updatedList = db.map(item => {
              if ((item as any)[column] === value) {
                updatedCount++;
                return { ...item, ...values, updated_at: new Date().toISOString() };
              }
              return item;
            });
            if (updatedCount > 0) {
              this.saveStorage(updatedList);
            }
            return {
              then: async (resolve: any) => {
                resolve({ data: updatedList.filter(item => (item as any)[column] === value), error: null });
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            const db = this.getStorage();
            const filtered = db.filter((r: any) => r[column] !== value);
            this.saveStorage(filtered);
            return {
              then: async (resolve: any) => {
                resolve({ data: null, error: null });
              }
            };
          }
        };
      }
    };
  }
}

// Initialize Supabase if keys provided, otherwise gracefully fallback
export const supabase = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new LocalStorageSupabaseMock() as any);
