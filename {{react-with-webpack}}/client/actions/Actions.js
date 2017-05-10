export function ReadContent(contentAll, contentNumber) {
  return { type: 'READ_CONTENT', contentAll, contentNumber }
}

export function WritePage() {
  return { type: 'WRITE_PAGE' }
}

export function ContentPage() {
  return { type: 'CONTENT_PAGE' }
}

export function EditPage(id) {
  return { type: 'EDIT_PAGE', id }
}
