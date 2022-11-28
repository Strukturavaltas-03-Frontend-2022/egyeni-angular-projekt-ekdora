import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-movie-editor',
  templateUrl: './movie-editor.component.html',
  styleUrls: ['./movie-editor.component.scss']
})
export class MovieEditorComponent implements OnInit {

  public movieEditorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.movieEditorForm = this.fb.group({
      title: [undefined, [Validators.required, Validators.minLength]],
      genre: [undefined, [Validators.required,]],
      director: [undefined, [Validators.required, Validators.minLength]],
      releaseYear: [undefined, [Validators.required,]],
      studio: [undefined, [Validators.required, Validators.minLength]],
      active: [false],
    });
  }

  ngOnInit(): void {
  }

}
