import { Directive, EventEmitter, ElementRef, Input, Output, HostListener } from '@angular/core';
import { FileItem } from '../models/file-item.models';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  
  //Archivos a controlar
  @Input() archivos:FileItem[]=[];

  @Output() mouseSobre: EventEmitter<boolean>= new EventEmitter();  


  constructor() { }

  @HostListener ('dragover',['$event'])
  public onDragEnter(event:any){
    this.mouseSobre.emit( true )   
    this._prevenirDetener(event); 
  }
  
  @HostListener('dragleave', ['$event'])
  public onDragEnd( event:any){
    this.mouseSobre.emit( false )    
  }

  @HostListener('drop', ['$event'])
  public onDrop( event:any){
    
    const transferencia = this._getTranferencia( event);
    
    if(!transferencia){
      return;
    }
    
    this._extraerArchivos(transferencia.files)
    this._prevenirDetener(event);

    this.mouseSobre.emit( false );   
  }

  //para extender la compatibilidad
  private _getTranferencia (event : any){
    return event.dataTransfer ? event.dataTransfer : event.original.dataTransfer; 
    
  }

  private _extraerArchivos( archivosLista: FileList){
    
    for(const propiedad in Object.getOwnPropertyNames(archivosLista)){
      
      const archivoTemporal = archivosLista[propiedad];
      //Evaluar si se puede cargar archivo retornado 
      
      if( this._archivoPuedeSerCargado( archivoTemporal) ){
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }      
    }
    console.log(this.archivos);

  }
  
  //Validaciones
  private _archivoPuedeSerCargado( archivo:File ):boolean{
    
    if( !this._archivoYaFueDroppeado( archivo.name ) && this._esImagen( archivo.type )){
      return true;
    }else{
      return false;
    }

  }

  private _prevenirDetener( event ){
    event.preventDefault();
    event.stopPropagation();
  }


  private _archivoYaFueDroppeado ( nombreArchivo:string): boolean{

    for ( const archivo of this.archivos ){

      if ( archivo.nombreArchivo === nombreArchivo ){
        console.log('El archivo ' +nombreArchivo+ ' ya fue agregado!');
        return true;
      }

    }
    return false;
  }


  private _esImagen( tipoArchivo:string):boolean{
    return ( tipoArchivo=='' || tipoArchivo == undefined? false : tipoArchivo.startsWith('image'));
    // se lee el docType para determinar si es tipo imagen (png, jpg, etc)
  }

}
