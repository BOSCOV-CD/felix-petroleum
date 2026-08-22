const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const note = document.getElementById('form-note');
  note.textContent = 'Thanks — your enquiry is ready. Connect this form to your email/CRM to receive submissions.';
  form.reset();
  return false;
}
