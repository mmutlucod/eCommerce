import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';

ClassicEditor.builtinPlugins = [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    CodeBlock,
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'codeBlock',
            'undo',
            'redo'
        ]
    },
    language: 'en'
};

export default ClassicEditor;
