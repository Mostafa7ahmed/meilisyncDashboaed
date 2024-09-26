import { CommonModule } from '@angular/common';
import { SourceService } from '../../Core/service/source.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-source',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})

export class SourceComponent implements OnInit {
  meiliData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  pageSize = 10;
  productId: string = '';
  editsource: FormGroup;
  sourceForm: FormGroup;

  constructor(private _sourceService: SourceService) {
    this.sourceForm = new FormGroup({
      label: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      type: new FormControl(0),
    });


    this.editsource = new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      type: new FormControl(0),
    });
  }



  // Fetch paginated data
  getData(pageNumber: number = 1) {
    this._sourceService.getAll(pageNumber, this.pageSize).subscribe({
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
  
  editSource(id: string) {
    this._sourceService.getSourceById(id).subscribe({
      next: (res) => {
        this.editsource = new FormGroup({
          id: new FormControl(res.result.id),
          label: new FormControl(res.result.label, Validators.required),
          url: new FormControl(res.result.url, Validators.required),
          type: new FormControl(0),
        });
      },
      error: (err) => {
        console.error('Error fetching data for edit:', err);
      }
    });
  }

  // Update product details
  updateSource(): void {
    if (this.editsource.valid) {
      this._sourceService.updateSource(this.editsource.value).subscribe({
        next: (res) => {
          this.getData(this.currentPage); // Refresh data
          this.closeModal('editmodel')
        },
        error: (err) => {
          console.error('Error updating item:', err);
        }
      });
    }
  }
  // Add new source
  addSource(data: FormGroup) {
    if (data.valid) {
      const formData = data.value;
      formData.type = 0; // Default type set to 0
      this._sourceService.addSource(formData).subscribe({
        next: (res) => {
          console.log('Success:', res);
          this.getData(this.currentPage); // Refresh the data
          this.closeModal('addSourceModal'); // Close the modal after success
          this.resetForm(); // Reset the form after submission
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }



  // Delete a source
  deleteMeili(id: string) {
    this._sourceService.deleteSource(id).subscribe({
      next: (res) => {
        console.log('Item deleted:', res);
        this.getData(this.currentPage); 
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      }
    });
  }

  // Handle pagination
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  // Close the modal
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement!);
    modal.hide();
  }

  // Reset the form to initial state
  resetForm() {
    this.sourceForm.reset({ label: '', url: '', type: 0 });
  }


  ngOnInit() {
    this.getData(this.currentPage);
  }
}
