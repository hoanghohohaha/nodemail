const nodemailer = require("nodemailer");
const pug = require("pug");
applicants = require("./allapp.json");
testing = require("./testing.json");
require("dotenv").config();

const {
  GMAIL_EMAIL = process.env.GMAIL_EMAIL,

  CLIENT_ID = process.env.CLIENT_ID,

  CLIENT_SECRET = process.env.CLIENT_SECRET,

  REFRESH_TOKEN = process.env.REFRESH_TOKEN,
} = process.env;

async function sendmail(email, name, position, url) {
  let transporter = await nodemailer.createTransport({
    pool: true,

    rateLimit = 1,
    // Service
    service: "Gmail",
    // Auth
    auth: {
      type: "OAuth2",
      // Email use to send email (Your Google Email. Eg: xxx@gmail.com)
      user: GMAIL_EMAIL,
      // Get in Google Console API (GMAIL API)
      clientId: CLIENT_ID,
      // Get in Google Console API (GMAIL API)
      clientSecret: CLIENT_SECRET,
      // Get from Google OAuth2.0 Playground (Using Cliet ID & Client Secret Key)
      refreshToken: REFRESH_TOKEN,
    },
  });
  var mailOptions = {
    from: "Vietcode <recruit@vietcode.org>",
    to: email,
    subject: `Vietcode - Thư mời tham dự phỏng vấn vị trí ${position}`,
    html: pug.renderFile(__dirname + "/emails/mars/reconfirm.pug", {
      name: name,
      position: position,
      url: url,
    }),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error + "\n" + "EndUser:" + name + `<${email}> `);
    } else {
      console.log(
        "\x1b[33m%s\x1b[0m",
        "Email sent: " +
          info.response +
          "\n" +
          "EndUser: " +
          name +
          `<${email}>`
      );
      console.log(position);
      console.log(url);
    }
  });
}

function classifyPosition(position, team) {
  switch (position) {
    default:
      return "404";
    case "Researcher":
      return "https://calendly.com/duc_vietcode/15min";
    case "Graphic Designer":
    case "Marketing - Branding":
    case "Sales - Branding":
      return "https://calendly.com/giangvietcode/branding-interview";
    case "PM - Outsource":
    case "Moderator":
      return "https://calendly.com/vietcodemanagement/management-interview";
    case "Business Analyst":
    case "Wordpress Developer":
      return "https://calendly.com/bhuonggiang03/outsource-interview";
    case "Talent Management Staff":
    case "Talent Acquisition Staff":
      return "https://calendly.com/hoangvietcode/interview";
    case "Frontend Developer":
    case "Backend Developer":
    case "Marketing - Insource":
    case "Sales - Insource":
    case "UI/UX Designer":
      switch (team) {
        default:
          return "404";
        case "Web":
          return "https://calendly.com/dminh/web-interview";
        case "Projectube":
          return "https://calendly.com/minhpham1606/projectube";
      }
  }
}

// sendmail("nguyendoanhoang0705@gmail.com", "hoang", "demo", "www.google.com");

async function sendrejectletter() {
  let email;
  let name;
  testing.forEach((val) => {
    email = val.email;
    name = val.name;
    team = val.team;
    val.position.forEach((position) => {
      if (classifyPosition(position, team) != "404") {
        sendmail(email, name, position, classifyPosition(position, team));
      } else {
        console.log(email, name, position);
        console.log("error occur");
      }
    });
  });
}

sendrejectletter();
