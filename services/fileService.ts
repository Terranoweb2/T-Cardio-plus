import { db } from './db';
import { SharedFile } from '../types';

/**
 * Ajoute un nouveau fichier à la base de données.
 * @param fileData Les données du fichier à ajouter (sans l'ID).
 * @returns Une promesse résolue avec l'ID du nouveau fichier.
 */
export async function addFile(fileData: Omit<SharedFile, 'id'>): Promise<number> {
  return db.sharedFiles.add(fileData as SharedFile);
}

/**
 * Récupère un fichier par son ID.
 * @param id L'ID du fichier à récupérer.
 * @returns Une promesse résolue avec les données du fichier ou null s'il n'est pas trouvé.
 */
export async function getFileById(id: number): Promise<SharedFile | null> {
  const file = await db.sharedFiles.get(id);
  return file || null;
}