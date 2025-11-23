'use client';
import Header from '../../components/Header';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관 및 개인정보처리방침</h1>
          <p className="text-gray-600">
            Eunpyeong Archive 서비스 이용약관 및 개인정보 처리에 관한 정책입니다.
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            
            {/* 이용약관 섹션 */}
            <div className="mb-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">이용약관</h1>
              
              {/* Article 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  본 약관은 Eunpyeong Archive(이하 "서비스")에서 제공하는 온라인 학술 자료 아카이브 서비스의 
                  이용조건 및 절차에 관한 사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              {/* Article 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>"서비스"란 Eunpyeong Archive가 제공하는 온라인 학술 자료 공유 플랫폼을 의미합니다.</li>
                    <li>"회원"이란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 고객을 말합니다.</li>
                    <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 서비스가 승인하는 문자 또는 숫자의 조합을 의미합니다.</li>
                    <li>"콘텐츠"란 회원이 서비스 내에 게시한 논문, 포스터, 영상 등의 자료를 의미합니다.</li>
                  </ul>
                </div>
              </section>

              {/* Article 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 서비스는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 
                  공지함으로써 효력이 발생합니다.
                </p>
              </section>

              {/* Article 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (회원가입)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 회원가입은 신청자가 온라인으로 서비스에서 제공하는 가입신청 양식에 개인정보를 기록하여 
                  가입을 신청하고 서비스가 이를 승낙함으로써 체결됩니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 서비스는 다음 각 호에 해당하는신청에 대하여는 승낙을 하지 않을 수 있습니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>실명이 아니거나 타人的 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 서비스가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </section>

              {/* Article 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (회원의 의무)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회원은 다음 행위를 하여서는 안됩니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타人的 정보도용</li>
                  <li>서비스에 게시된 정보의 변경</li>
                  <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
                  <li>서비스 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>서비스 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지·화상·음성 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                </ul>
              </section>

              {/* Article 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (서비스의 제공 및 변경)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 서비스는 다음과 같은 업무를 수행합니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>학술 논문, 포스터, 영상 등의 자료 업로드 및 다운로드 서비스</li>
                  <li>자료 검색 및 분류 서비스</li>
                  <li>회원 간 자료 공유 및 의견 교환 서비스</li>
                  <li>기타 서비스가 정하는 업무</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 서비스는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
                </p>
              </section>

              {/* Article 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (저작권의 귀속 및 이용제한)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 서비스가 작성한 저작물에 대한 저작권 기타 지적재산권은 서비스에 귀속합니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 회원이 서비스에 게시한 콘텐츠의 저작권은 회원에게 귀속되며, 서비스는 회원의 동의 하에 
                  해당 콘텐츠를 서비스 운영 목적으로 이용할 수 있습니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  3. 회원은 서비스를 이용함으로써 얻은 정보 중 서비스에게 지적재산권이 귀속된 정보를 
                  서비스의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 
                  이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                </p>
              </section>

              {/* Article 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (개인정보보호)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  서비스는 관련법령이 정하는 바에 따라 회원 등록정보를 포함한 회원의 개인정보를 보호하기 위해 
                  노력합니다. 회원의 개인정보보호에 관해서는 관련법령 및 서비스가 정하는 개인정보처리방침에 
                  정한 바에 의합니다.
                </p>
              </section>

              {/* Article 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (서비스의 중단)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 서비스는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 
                  발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 서비스는 제1항의 사유로 서비스의 제공이 중단된 경우에는 미리 공지합니다. 
                  다만, 서비스가 통제할 수 없는 사유로 인한 서비스 중단의 경우에는 사후에 통지할 수 있습니다.
                </p>
              </section>

              {/* Article 10 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (면책조항)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 
                  서비스 제공에 관한 책임이 면제됩니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 서비스는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  3. 서비스는 회원이 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 
                  책임을 지지 않습니다.
                </p>
              </section>

              {/* Article 11 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제11조 (준거법 및 관할법원)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 서비스와 회원 간에 발생한 분쟁에 관한 소송은 대한민국법을 적용으며, 본 분쟁으로 
                  인한 소송은 서비스의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
                </p>
              </section>
            </div>

            {/* 개인정보처리방침 섹션 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">개인정보처리방침</h1>
              
              {/* 개인정보 Article 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (개인정보의 처리 목적)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Eunpyeong Archive는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 
                  다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 개인정보 보호법 
                  제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
                  <li>서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증</li>
                  <li>고지사항 전달, 불만처리 등을 위한 의사소통 경로의 확보</li>
                  <li>마케팅 및 광고에의 활용</li>
                </ul>
              </section>

              {/* 개인정보 Article 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (처리하는 개인정보의 항목)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. Eunpyeong Archive는 다음의 개인정보 항목을 처리하고 있습니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>필수항목: 이름, 이메일, 비밀번호, 학교, 학년</li>
                  <li>자동 수집 항목: 접속 IP 정보, 쿠키, MAC주소, 서비스 이용 기록, 방문 기록</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다:
                  IP 주소, 쿠키, MAC 주소, 서비스 이용 기록, 방문 기록, 불량 이용 기록 등
                </p>
              </section>

              {/* 개인정보 Article 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (개인정보의 처리 및 보유 기간)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. Eunpyeong Archive는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 
                  수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>회원 가입 및 관리: 서비스 이용계약 또는 회원가입 해지시까지, 다만 관계법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지</li>
                  <li>재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
                </ul>
              </section>

              {/* 개인정보 Article 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공에 관한 사항)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Eunpyeong Archive는 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
                  정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 
                  개인정보를 제3자에게 제공합니다.
                </p>
              </section>

              {/* 개인정보 Article 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (정보주체의 권리·의무 및 그 행사방법)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 정보주체는 Eunpyeong Archive에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 
                  행사할 수 있습니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>개인정보 처리현황 통복지구</li>
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보의 정정·삭제요구</li>
                  <li>손해배상 청구</li>
                </ul>
              </section>

              {/* 개인정보 Article 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (개인정보보호책임자)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. Eunpyeong Archive는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 
                  관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 
                  지정하고 있습니다:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>개인정보보호책임자</strong></p>
                  <p className="text-gray-700 text-sm">성명: 개인정보보호담당자</p>
                  <p className="text-gray-700 text-sm">연락처: privacy@eunpyeongarchive.co.kr</p>
                </div>
              </section>

              {/* 개인정보 Article 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (개인정보의 안전성 확보조치)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Eunpyeong Archive는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적·관리적 
                  및 물리적 조치를 하고 있습니다:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>개인정보 취급 직원의 최소화 및 교육</li>
                  <li>개인정보에 대한 접근 제한</li>
                  <li>개인정보를 안전하게 저장·전송할 수 있는 암호화 기법 사용</li>
                  <li>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위한 보안프로그램 설치</li>
                </ul>
              </section>
            </div>

            {/* Effective Date */}
            <section className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-600">
                <strong>시행일:</strong> 2025년 1월 1일
              </p>
              <p className="text-gray-600 mt-2">
                본 약관 및 개인정보처리방침은 시행일로부터 적용되며, 종전 약관은 본 약관으로 대체됩니다.
              </p>
            </section>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center whitespace-nowrap cursor-pointer"
          >
            동의하고 회원가입하기
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">
              2025 Eunpyeong Archive. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
