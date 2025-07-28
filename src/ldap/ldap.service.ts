// src/ldap/ldap.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ldap from 'ldapjs';

@Injectable()
export class LdapService implements OnModuleInit, OnModuleDestroy {
  private client: ldap.Client;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    // Creamos el cliente LDAP (AD_URL nunca será undefined gracias al '!')
    this.client = ldap.createClient({
      url: this.config.get<string>('AD_URL')!,
    });

    const url = this.config.get<string>('AD_URL')!;
    const dn  = this.config.get<string>('AD_BIND_DN')!;
    const pw  = this.config.get<string>('AD_BIND_PASSWORD')!;

    console.log('→ AD_URL:', url);
    console.log('→ AD_BIND_DN:', dn);
    console.log('→ AD_BIND_PASSWORD:', pw.replace(/./g, '*')); 
    


    // Hacemos bind al iniciar (AD_BIND_DN y AD_BIND_PASSWORD nunca serán undefined)
    this.client.bind(
      this.config.get<string>('AD_BIND_DN')!,
      this.config.get<string>('AD_BIND_PASSWORD')!,
      (err) => {
        if (err) {
          console.error('Error haciendo bind a AD:', err);
        } else {
          console.log('🔗 Conectado a Active Directory');
        }
      },
    );
  }

  onModuleDestroy() {
    // Deshacemos el bind al destruir el módulo
    this.client.unbind();
  }

  /**
   * Método genérico para buscar en Active Directory.
   * @param filter Filtro LDAP, p.ej. "(sAMAccountName=usuario)"
   * @param attributes Lista de atributos a traer
   * @returns Promise con array de objetos retornados por AD
   */
  search(filter: string, attributes: string[] = []): Promise<any[]> {
    // El baseDN nunca será undefined gracias al '!'
    const baseDN = this.config.get<string>('AD_BASE_DN')!;
    const opts: ldap.SearchOptions = { filter, scope: 'sub', attributes };

    return new Promise((resolve, reject) => {
      // Aseguramos que entries sea any[], no never[]
      const entries: any[] = [];

      this.client.search(baseDN, opts, (err, res) => {
        if (err) {
          return reject(err);
        }

        // Cada vez que llega una entrada, la agregamos al array
        res.on('searchEntry', (entry: any) => {
        entries.push(entry.object);
      });


        res.on('error', (error) => reject(error));
        res.on('end', () => resolve(entries));
      });
    });
  }
}
