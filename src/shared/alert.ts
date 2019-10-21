import Swal from 'sweetalert2';
export const success = (title: string) => {
    Swal.fire(
        'Good job!',
        title,
        'success'
    )
}
export const error = (title: string) => {
    Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: title
    })
}