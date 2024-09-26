import { Routes } from '@angular/router';
import { SyncComponent } from './Compoenents/sync/sync.component';
import { MeilisearchComponent } from './Compoenents/meilisearch/meilisearch.component';
import { SourceComponent } from './Compoenents/source/source.component';

export const routes: Routes = [
    {path:'meilisearch' , component:MeilisearchComponent},
    {path:'source' , component:SourceComponent},

    {path:'sync' , component:SyncComponent},


];
