import Quill from 'quill';

const ImageBlot = Quill.import('formats/image');

export default class CustomImageBlot extends ImageBlot {

  static blotName = 'customImage';
  static tagName = 'img';

  /**
   * Converts the HTML tag to image blot
   * @param value 
   */
  static create(value) {

    let node = super.create();

    node.setAttribute('src', value.src);
    node.setAttribute('data-attr', value.data_attr);

    return node;
  }

  /**
   * Converts the image blot to HTML tag
   * @param node 
   */
  static value(node) {

    var blot = {};

    blot.src = node.getAttribute('src');
    blot.data_attr = node.getAttribute('data-attr');

    return blot;
  }
}