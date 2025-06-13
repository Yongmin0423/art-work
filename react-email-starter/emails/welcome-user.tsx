import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface RaycastMagicLinkEmailProps {
  magicLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const RaycastMagicLinkEmail = ({
  magicLink,
}: RaycastMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Log in with this magic link.</Preview>
      <Container style={container}>
        {/* <Img
          src={`${baseUrl}/static/raycast-logo.png`}
          width={48}
          height={48}
          alt="Raycast"
        /> */}
        <Heading style={heading}>Welcome to Artwork!</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={magicLink}>
              👉 Click here to sign in 👈
            </Link>
          </Text>
          <div style={containerStyle}>
            <p style={paragraphStyle}>안녕하세요, 회원님.</p>

            <p style={paragraphStyle}>
              아티스트와 고객을 잇는 가장 간편한 다리, <strong>아트워크</strong>
              에 오신 것을 환영합니다.
            </p>

            <p style={paragraphStyle}>
              아트워크는 재능 있는 작가님들이 자신의 작품을 세상에 알리고,
              고객들은 상상 속의 그림을 현실로 만날 수 있는 공간입니다.
            </p>

            <p style={paragraphStyle}>
              저희는 이 멋진 연결이{" "}
              <strong style={strongStyle}>'누구나'</strong>,{" "}
              <strong style={strongStyle}>'쉽고 간편하게'</strong> 이루어져야
              한다고 믿습니다.
            </p>

            <p style={paragraphStyle}>
              이제 복잡한 과정은 아트워크에 맡기고, 가장 중요한 것에만
              집중하세요.
            </p>

            <p style={paragraphStyle}>
              아트워크의{" "}
              <strong
                style={{
                  ...strongStyle,
                  ...{ borderBottom: "2px solid #007bff30" },
                }}
              >
                [통합 커미션 관리]
              </strong>{" "}
              기능을 사용하면, 작품 의뢰부터 시안 확인, 수정 요청, 결제까지 모든
              과정을 한곳에서 투명하고 체계적으로 진행할 수 있습니다.
            </p>

            <p style={paragraphStyle}>
              더 이상 여러 채널을 오가며 소통하느라 시간을 낭비하지 마세요.
              작가님은 오직 창작에만, 고객님은 작품을 통한 영감과 소통에만
              집중할 수 있습니다.
            </p>

            <p style={paragraphStyle}>
              자, 이제 아트워크와 함께 첫발을 내디뎌 볼까요?
            </p>

            <p style={footerStyle}>
              당신의 멋진 여정을 응원하며,
              <br />
              <strong>아트워크 팀 드림</strong>
            </p>
          </div>
        </Section>

        <Hr style={hr} />
        {/* <Img
          src={`${baseUrl}/static/raycast-logo.png`}
          width={32}
          height={32}
          style={{
            WebkitFilter: "grayscale(100%)",
            filter: "grayscale(100%)",
            margin: "20px 0",
          }}
        /> */}
        <Text style={footer}>Artwork Inc.</Text>
      </Container>
    </Body>
  </Html>
);

RaycastMagicLinkEmail.PreviewProps = {
  magicLink: "https://raycast.com",
} as RaycastMagicLinkEmailProps;

export default RaycastMagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/static/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};

const containerStyle = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  maxWidth: "600px",
  margin: "20px auto",
  padding: "30px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#333333",
  lineHeight: "1.6",
};

const paragraphStyle = {
  fontSize: "16px",
  margin: "0 0 16px 0",
};

const strongStyle = {
  color: "#0056b3", // 브랜드 컬러 등 강조색으로 변경 가능
};

const ctaContainerStyle = {
  textAlign: "center",
  margin: "32px 0",
};

const buttonStyle = {
  display: "inline-block",
  padding: "12px 28px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#ffffff",
  backgroundColor: "#007bff", // 브랜드 컬러로 변경 가능
  textDecoration: "none",
  borderRadius: "5px",
};

const footerStyle = {
  marginTop: "32px",
  fontSize: "16px",
};
