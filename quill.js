import Quill from 'quill/core';

import Toolbar from 'quill/modules/toolbar';
import ImageResize from './image-resize.min';

import Snow from 'quill/themes/snow';

import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Header from 'quill/formats/header';

// var ColorClass = Quill.import('attributors/class/color');
// var SizeStyle = Quill.import('attributors/style/size');
// Quill.register(ColorClass, true);
// Quill.register(SizeStyle, true);

// Quill.register({
//   'modules/toolbar': Toolbar,
//   'modules/imageResize': ImageResize,
//   'themes/snow': Snow,
//   // 'formats/bold': Bold,
//   // 'formats/italic': Italic,
//   // 'formats/header': Header
// });

// Quill.register('modules/imageResize', ImageResize);

export default Quill;