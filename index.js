import Quill from 'quill';
import ImageResize from './modules/image-resizer-module/src/ImageResize';
import UploadInEditor from './modules/upload-in-editor-module/UploadInEditor';
import Image from './blots/Image';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/uploadInEditor', UploadInEditor);
Quill.register(Image, true);

const toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['link', 'image']];

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: toolbarOptions,
    uploadInEditor: true,
    imageResize: {
      displaySize: true
    },
  },
});