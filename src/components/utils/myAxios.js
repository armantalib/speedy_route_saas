import axios from 'axios';

 const mainUrl = "http://192.168.100.59:8080/api/";
//  const mainUrl = "https://api.speedyroute.ai/api/";
 export const socketUrl = "https://api.speedyroute.ai/";



export async function dataGet({ body,endPoint}) {
  
  return await axios
          .post(mainUrl+endPoint, body, 
            
    { 
      headers: { 
        'Authorization': `Bearer ${global.accessToken}`,
        'Content-Type': 'multipart/form-data' 
      } ,
    }
)
    .then(res => {
      return res.data
    })  
    .catch(err => {
        console.log("Error",err);
      // showToast('Please check your internet connection');
      return err
  });
}

export async function dataPost(endPoint, body) {
  const token  = localStorage.getItem('token');
  console.log("Toe",token);
  return axios({
    method: 'post',
    url: mainUrl + endPoint,
    headers: {
      'x-auth-token': `${token}`,
      'Content-Type': 'application/json'
    },
    data: body
  })
    .then(res => {
      return res
    })
    .catch(err => {
      // showToast(err.response.data.message);
      console.log("ERR", err.response.data.message);
      return err.response
    });
}

export async function dataPut(endPoint, body) {
  const token  =  localStorage.getItem('token');
  console.log("Toe",token);
  return axios({
    method: 'put',
    url: mainUrl + endPoint,
    headers: {
      'x-auth-token': `${token}`,
      'Content-Type': 'application/json'
    },
    data: body
  })
    .then(res => {
      return res
    })
    .catch(err => {
      // showToast(err.response.data.message);
      console.log("ERR", err.response.data.message);
      return err.response
    });
}

export async function dataDelete(endPoint, body) {
  const token  = localStorage.getItem('token');
  console.log("Toe",token);
  return axios({
    method: 'delete',
    url: mainUrl + endPoint,
    headers: {
      'x-auth-token': `${token}`,
      'Content-Type': 'application/json'
    },
    data: body
  })
    .then(res => {
      return res
    })
    .catch(err => {
      // showToast(err.response.data.message);
      console.log("ERR", err.response.data.message);
      return err.response
    });
}

export async function dataGet_(endPoint, body) {
  
  const token  =  localStorage.getItem('token');
  console.log("Toe",token);
  return axios({
    method: 'get',
    url: mainUrl + endPoint,
    headers: {
      'x-auth-token': `${token}`,
      'Content-Type': 'application/json'
    },
    // data: body
  })
    .then(res => {
      return res
    })
    .catch(err => {
      // showToast(err.response.data.message);
      console.log("ERR", err.response.data.message);
      return err.response
    });
}

export async function dataGet2_(endPoint, body) {
  
  return axios({
    method: 'get',
    url: mainUrl + endPoint,
    headers: {
      'Content-Type': 'application/json'
    },
    // data: body
  })
    .then(res => {
      return res
    })
    .catch(err => {
      // showToast(err.response.data.message);
      console.log("ERR", err.response.data.message);
      return err.response
    });
}
