import defaultsDeep from 'lodash/defaultsDeep';
import sections from '../../constant';

/**
 * Custom module for quilljs to allow user to upload image via clicking on
 * image button in editor
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class UploadInEditor {

    constructor(quill, options = {}) {
        // save the quill reference and options
        this.quill = quill;

        // Apply the options to our defaults, and stash them for later
        // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
        let moduleClasses = false;
        if (options.modules) {
            moduleClasses = options.modules.slice();
        }

        // Apply options to default options
        // this.options = defaultsDeep({}, options, DefaultOptions);
        this.options = options;

        // (see above about moduleClasses)
        if (moduleClasses !== false) {
            this.options.modules = moduleClasses;
        }

        // respond to clicks inside the editor
        this.quill.root.addEventListener('click', this.handleClick, false);

        this.quill.root.parentNode.style.position = this.quill.root.parentNode.style.position || 'relative';

        // setup modules
        this.moduleClasses = this.options.modules;

        this.modules = [];
    }

    initializeModules = () => {
        this.removeModules();

        this.modules = this.moduleClasses.map(
            ModuleClass => new (knownModules[ModuleClass] || ModuleClass)(this),
        );

        this.modules.forEach(
            (module) => {
                module.onCreate();
            },
        );

        this.onUpdate();
    };

    onUpdate = () => {
        this.repositionElements();
        this.modules.forEach(
            (module) => {
                module.onUpdate();
            },
        );
    };

    removeModules = () => {
        this.modules.forEach(
            (module) => {
                module.onDestroy();
            },
        );

        this.modules = [];
    };

    handleClick = (evt) => {
        // click on image upload icon in editor
        if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG'
        && evt.target.src.includes('template-uploader-thumbnail.jpg')) {
            const fileupload = document.createElement('input');
            fileupload.type = 'file';
            fileupload.style.display = 'none';
            fileupload.onchange = () => { 
                console.log(fileupload.files);
                const files = fileupload.files;
                // FileReader support
                if (FileReader && files && files.length) {
                    var fr = new FileReader();
                    fr.onload = function () {
                        evt.target.src = fr.result;
                    }
                    fr.readAsDataURL(files[0]);
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
                // evt.target.src = fileupload.files[0];
            };
            fileupload.click();
        }
    };

    show = (img) => {
        // keep track of this img element
        this.img = img;

        this.showOverlay();

        this.initializeModules();
    };

    showOverlay = () => {
        if (this.overlay) {
            this.hideOverlay();
        }

        this.quill.setSelection(null);

        // prevent spurious text selection
        this.setUserSelect('none');

        // listen for the image being deleted or moved
        document.addEventListener('keyup', this.checkImage, true);
        this.quill.root.addEventListener('input', this.checkImage, true);

        // Create and add the overlay
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, this.options.overlayStyles);

        this.quill.root.parentNode.appendChild(this.overlay);

        this.repositionElements();
    };

    hideOverlay = () => {
        if (!this.overlay) {
            return;
        }

        // Remove the overlay
        this.quill.root.parentNode.removeChild(this.overlay);
        this.overlay = undefined;

        // stop listening for image deletion or movement
        document.removeEventListener('keyup', this.checkImage);
        this.quill.root.removeEventListener('input', this.checkImage);

        // reset user-select
        this.setUserSelect('');
    };

    repositionElements = () => {
        if (!this.overlay || !this.img) {
            return;
        }

        // position the overlay over the image
        const parent = this.quill.root.parentNode;
        const imgRect = this.img.getBoundingClientRect();
        const containerRect = parent.getBoundingClientRect();

        Object.assign(this.overlay.style, {
            left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
            top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
            width: `${imgRect.width}px`,
            height: `${imgRect.height}px`,
        });
    };

    hide = () => {
        this.hideOverlay();
        this.removeModules();
        this.img = undefined;
    };

    setUserSelect = (value) => {
        [
            'userSelect',
            'mozUserSelect',
            'webkitUserSelect',
            'msUserSelect',
        ].forEach((prop) => {
            // set on contenteditable element and <html>
            this.quill.root.style[prop] = value;
            document.documentElement.style[prop] = value;
        });
    };

    checkImage = (evt) => {
        if (this.img) {
            if (evt.keyCode == 46 || evt.keyCode == 8) {
                window.Quill.find(this.img).deleteAt(0);
            }
            this.hide();
        }
    };
}

if (window.Quill) {
  window.Quill.register('modules/uploadInEditor', UploadInEditor);
}
