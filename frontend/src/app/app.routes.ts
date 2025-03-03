import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { KmapTableComponent } from './kmap-table/kmap-table.component';

export const routes: Routes = [
    {    path: '',  
        component: StartComponent,
    },

    {    path: 'game',  
        component: KmapTableComponent,
    },
          
    { path: '**', 
        component: StartComponent
    }


    
];

export default routes;