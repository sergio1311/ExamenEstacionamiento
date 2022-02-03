import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, Observable } from 'rxjs';

export interface Vehiculo {
  id?: string;
  horaEntrada:Date;
  diaEntrada:String;
  placas:string;
  tipoVehiculo:string;
  
}
export interface Salida {
  id?:string;
  horaEntrada:Date;
  diaEntrada:string;
  placas:string;
  tipoVehiculo:string;
  horaSalida:string;
  diaSalida:string;
  total:number;
  
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {

  private vehiculoCollection: AngularFirestoreCollection<Vehiculo>;
  private vehiculo: Observable<Vehiculo[]>;

  private salidaCollection: AngularFirestoreCollection<Salida>;
  private salida: Observable<Salida[]>;


  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {

    this.vehiculoCollection = this.afs.collection<Vehiculo>('vehiculo');
    this.vehiculo = this.vehiculoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );

    this.salidaCollection = this.afs.collection<Salida>('salida');
    this.salida = this.salidaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
    
   }
   // ---------------------- VEHICULO --------------------------
  AddVehiculo(v: Vehiculo): Promise<DocumentReference>{
    return this.vehiculoCollection.add(v);
  }
  GetVehiculo(): Observable<Vehiculo[]> {
    return this.vehiculo;
  }
  DeleteVehiculo(p: Vehiculo): Promise<void>{
    return this.vehiculoCollection.doc(p.id).delete();
  }

  // ---------------------- SALIDAS --------------------------
  AddSalida(v: Salida): Promise<DocumentReference>{
    return this.salidaCollection.add(v);
  }
  GetSalida(): Observable<Salida[]> {
    return this.salida;
  }
  GetSalidaByFecha(fecha:string)
  {
    return this.salida.pipe(
      map(items => 
        items.filter(item => item.diaSalida=== fecha ))
    )
  }
  GetSalidaByHora(hora:string)
  {
    return this.salida.pipe(
      map(items => 
        items.filter(item => item.horaSalida=== hora ))
    )
  }
  

}
