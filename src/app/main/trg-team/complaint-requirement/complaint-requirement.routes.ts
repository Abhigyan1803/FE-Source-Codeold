import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintRequirementComponent } from './complaint-requirement.component';

export const complaintrequirementRoutes : Routes = [
    { path: '', component: ComplaintRequirementComponent, pathMatch: 'full' },
    { path: 'add-complaints', loadChildren: () => import('./add-complaints/add-complaints.module').then(m => m.AddComplaintsModule) },
    { path: 'view-complaints', loadChildren: () => import('./add-complaints/add-complaints.module').then(m => m.AddComplaintsModule) },
    {  path: 'it', loadChildren: () => import('./it/it.module').then(m => m.ItModule) },
];