import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsynService } from '../../Core/service/asyn.service';
declare var bootstrap: any;
@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sync.component.html',
  styleUrl: './sync.component.scss'
})
export class SyncComponent {



  meiliData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  pageSize = 10;
  editmelie!: FormGroup;

  meilForm = new FormGroup({
    label: new FormControl(null, Validators.required),
    sourceId: new FormControl(null, Validators.required),
    meiliSearchId: new FormControl(null, Validators.required),
  });

  constructor(private _AsynService:AsynService  ) {}

  ngOnInit(): void {
    this.getData(this.currentPage);
  }

  // Fetch paginated data
  getData(pageNumber: number = 1) {
    this._AsynService.getAll(pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.meiliData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  // Initialize form for editing
  editMelie(id: string) {
    this._AsynService.getSyncById(id).subscribe({
      next: (res) => {
        this.editmelie = new FormGroup({
          id: new FormControl(res.id),
          label: new FormControl(res.label, Validators.required),
          url: new FormControl(res.url, Validators.required),
          apiKey: new FormControl(res.apiKey, Validators.required),
        });
      },
      error: (err) => {
        console.error('Error fetching data for edit:', err);
      }
    });
  }

  // Update product details
  updateMelie(): void {
    if (this.editmelie.valid) {
      this._AsynService.updateSync(this.editmelie.value).subscribe({
        next: (response) => {
          console.log('Product updated successfully', response);
          this.getData(this.currentPage);
          this.closeModal(); // Close modal on success
        },
        error: (err) => {
          console.error('Error updating product:', err);
        },
      });
    }
  }

  // Handle form submission to add a new MeiliSearch instance
  addMeili(data: FormGroup) {
    if (data.valid) {
      this._AsynService.addSync(data.value).subscribe({
        next: (res) => {
          console.log('Success:', res);
          this.closeModal(); // Close modal on success
          this.getData(this.currentPage); // Refresh the data after adding new entry
          data.reset(); // Reset form
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }

  // Delete a MeiliSearch instance
  deleteMeili(id: string) {
    this._AsynService.deleteSync(id).subscribe({
      next: (res) => {
        console.log('Item deleted:', res);
        this.getData(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      }
    });
  }

  // Change pagination page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  // Close the modal
  closeModal() {
    const modalElement = document.querySelector('#exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

  }
}
