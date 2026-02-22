export const isAuth = () => {
    const token = localStorage.getItem("token");
    if (!!token == true) {
        return " Ok "
    }
    return !!token;
}