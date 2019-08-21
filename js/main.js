const url = '../docs/a.pdf'; // Constant of where the pdf is

/* Varıables. --------------------------------------------- */
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
    canvas = document.getElementById('pdf-render'),
    _context = canvas.getContext('2d');
// -----------------------------------------------------------

// Rendering the page.
const renderPage = num => {
    pageIsRendering = true;

    // Getting the page.
    pdfDoc.getPage(num).then(page => {

        // Setting scale.
        const viewport = page.getViewport({
            scale
        });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const render_context = {
            canvasContext: _context,
            viewport
        }

        page.render(render_context).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }

        });

        // Outputting the current page.
        document.getElementById('page-num').textContent = num;
    });
};

// Check for pages rendering.
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
}

// SHOW PREV NEXT PAGES FUNCTIONS ---------------------------------------

// Show Prev Page
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

// Show Prev Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);

} // -------------------------------------------------------------------

// Getting the document.
pdfjsLib.getDocument(url).promise.then(PdfDoc => {
        pdfDoc = PdfDoc;

        // Add the numbers to html inself.
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        renderPage(pageNum);
    })
    .catch(err => {
        // Display error.
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(err.message));
        document.querySelector('body').insertBefore(div, canvas);

        // Removing the top bar on Error.
        document.querySelector('.top-bar').getElementsByClassName.display = 'none';
    });

// Button Events. 
document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.getElementById('next-page').addEventListener('click', showNextPage);