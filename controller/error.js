exports.get404 = (req,res,next) => {

    res.status(404).render("notfound", {myTitle:"Error : 404"});
}