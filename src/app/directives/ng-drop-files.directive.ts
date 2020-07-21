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
  }
  
  @HostListener('dragleave', ['$event'])
  public onDragEnd( event:any){
    //this.mouseFuera.emit( false);
    this.mouseSobre.emit( false )    
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
        console.log('El archivo'+ nombreArchivo+ 'ya fue agregado!');
        return true;
      }

    }
    return false;
  }


  private _esImagen( tipoArchivo:string):boolean{
    return ( tipoArchivo=='' || tipoArchivo == undefined? false : tipoArchivo.startsWith('image'));
    // se lee el docType para determinar si es tipo imagen(png, jpg, etc)
  }

}
