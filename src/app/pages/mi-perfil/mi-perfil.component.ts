import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Paciente, Usuario, Especialista, Administrador } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { getDownloadURL } from '@angular/fire/storage';
import { style, transition, trigger,state,animate } from '@angular/animations';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
  animations:[
    trigger('animacionPerfil',[
      state('foto1',style({
      backgroundColor: 'dark',
      color: 'light-green'
      })),
      state('foto2',style({
        backgroundColor: 'green',
        color: 'yellow'
      })),
      transition('foto1 <=> foto2',
      animate(700)
      )

    ])

  ]
})
export class MiPerfilComponent implements OnInit {

  public usuario!: Usuario;
  public paciente!: Paciente;
  public especialista!: Especialista;
  public administrador!: Administrador;
  public foto: string;
  public foto2: string;
  public cambiar:boolean=false;
  public verHistoria:boolean=false;
  public estadoPerfil:string;

  constructor(private auth: AuthService,private firestore: FirestoreService,private router:Router) {
    this.usuario=new Usuario("","","",0,0,"","","","");
    this.paciente=new Paciente("","","",0,0,"","","","","");
    this.especialista=new Especialista("","","",0,0,"","","","","");
    this.administrador=new Administrador("","","",0,0,"","","","");
    this.foto="";
    this.foto2="";
    this.estadoPerfil="foto1";
  }

  async ngOnInit(): Promise<void> {
    const user= await this.auth.getState();

    if(user)
    {
      this.usuario=this.auth.usuario;

      const fotos= await this.firestore.traerFotos();

      for (const item of fotos.items)
      {
        const url=await getDownloadURL(item);

        if(this.usuario.pathPerfil==item.name)
        {
          this.foto=url;
        }

        if(this.usuario.perfil=='paciente')
        {
          this.paciente= <Paciente>this.usuario;

          if(this.paciente.pathPerfil2==item.name)
          {
            this.foto2=url;
          }
        }else if(this.usuario.perfil=='especialista')
        {
          this.especialista=<Especialista>this.usuario;
        }else if(this.usuario.perfil=='administrador')
        {
          this.administrador=<Administrador>this.usuario;
        }

      }
    }


  }


  cambiarFoto()
  {
    this.cambiar=!this.cambiar;
    this.estadoPerfil= this.estadoPerfil == 'foto1'? 'foto2': 'foto1';
  }

  verHistoriaClinica()
  {
    this.verHistoria=true;
  }

  volver()
  {
    this.verHistoria=false;
  }

}