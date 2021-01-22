import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Categorie } from '../../interfaces/categorie';
import { AngularFireStorage } from "@angular/fire/storage";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private CategorieCollection: AngularFirestoreCollection<Categorie>;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage,) {
    this.CategorieCollection = this.afs.collection<Categorie>('Categories');
  }

  getCategories() {
    return this.CategorieCollection.snapshotChanges().pipe(
      map(Categories => {
        return Categories.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addCategorie(categorie: Categorie,url){
    this.CategorieCollection.add(categorie)
    .then(async resp => {

      const imageUrl = await this.uploadFile(resp.id, url)

      this.CategorieCollection.doc(resp.id).update({
        picture: imageUrl || null
      })
    }).catch(error => {
      console.log(error);
    })
  }

  async uploadFile(id, file) {
    if(file && file.length) {
    
        const task = await this.storage.ref('catImages').child(id).put(file[0])
        return this.storage.ref(`catImages/${id}`).getDownloadURL().toPromise();
      
    }
  }
  getCategorie(id: string) {
    return this.CategorieCollection.doc<Categorie>(id).valueChanges();
  }


  async updateCategorie(id: string, categorie: Categorie,url) {
  
    const imageUrl = await this.uploadFile(id, url)

      this.CategorieCollection.doc(id).update({
        name:categorie.name,
        picture: imageUrl || categorie.picture
      }).catch(error => {
        console.log(error);
      })
    
  }
 

  deleteCategorie(id: string) {
    return this.CategorieCollection.doc(id).delete();
  }
}