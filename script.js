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
  const data = new FormData(form);
  const name = data.get('name') || 'Not provided';
  const company = data.get('company') || 'Not provided';
  const email = data.get('email') || 'Not provided';
  const message = data.get('message') || 'No details';

  const text = 'New enquiry from Felix Petroleum website\n\n' +
    'Name: ' + name + '\n' +
    'Company: ' + company + '\n' +
    'Email: ' + email + '\n\n' +
    'Message: ' + message;

  const url = 'https://wa.me/2347069649164?text=' + encodeURIComponent(text);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();

  note.textContent = 'WhatsApp is opening — press Send there to deliver your enquiry.';
  form.reset();
  return false;
}
