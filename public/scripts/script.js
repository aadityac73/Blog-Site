var loc = window.location.href;
if (/blogs/.test(loc) & !/new/.test(loc)) {
    $('.home').toggleClass('active');
}  if (/new/.test(loc)) {
    $('.newBlog').toggleClass('active');
}