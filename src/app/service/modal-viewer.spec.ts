import { TestBed } from '@angular/core/testing';
import { ModalViewer } from './modal-viewer';

describe('ModalViewer', () => {
  let service: ModalViewer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalViewer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
