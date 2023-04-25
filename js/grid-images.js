HOST = "https://s3.eu-central-1.amazonaws.com/www.merceaumatell.eu/"
IMAGES_TYPES = [".jpg", ".jpeg", ".png"]

function requestS3BucketContentList() {
    const Http = new XMLHttpRequest();
    const url=HOST;
    Http.open("GET", url, false);
    Http.send();
    return Http.responseText;
}

function shuffle(list) {
    var j, x, i;
    for (i = list.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = list[i];
        list[i] = list[j];
        list[j] = x;
    }
    return list;
}

function extractImgPaths(xmlS3BucketResponse) {
    parser = new DOMParser();
    parsedResponse = parser.parseFromString(xmlS3BucketResponse, "text/xml");
    listBucketResult = Array.from(parsedResponse.getElementsByTagName("ListBucketResult")[0].getElementsByTagName("Contents"))
    var isPathImage = path => path.startsWith('img/') & IMAGES_TYPES.some(char => path.toLowerCase().endsWith(char))
    return shuffle(listBucketResult
        .map(content => content.getElementsByTagName('Key')[0].innerHTML)
        .filter(path => isPathImage(path)))
}

function extractImgTitle(imgPath) {
    title = imgPath.split('/')[1]
    return title.split('_').join(' ')
}

function generateImgHtml(imgPaths) {
    var listHtml = imgPaths
    .map(path => {
        var host = HOST
        var hostSmall = HOST
        var absoluteImgPath = host + path
        var absoluteSmallImgPath = hostSmall + path
        var title = extractImgTitle(path)
        var template = 
        `<a href=${absoluteImgPath} class=swipebox title=${title} rel=${title}> <img src=${absoluteSmallImgPath} alt=image> </a>`
        return template
    }
    );
    return listHtml.join(' ')
}

var imgGallery = generateImgHtml(extractImgPaths(requestS3BucketContentList()))
document.getElementById("imgGallery").innerHTML = imgGallery;