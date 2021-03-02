// 무슨이유에서 인지 실행이 안됨

$("#serverbutton").click(() => {
    $.ajax(
        {
            type:"POST", // 서버 전송방식
            url:"./onlinejauge",
            data: {}, // 전송 피라미터
            datatype: "text", // 받아온 데이터타입 (생략이 가능함)
            success: (time)=> {$("#testtitle").html(time)},
            error: (log)=>{alert("컴파일에 실패하였습니다"+log)}
        }
    )
})