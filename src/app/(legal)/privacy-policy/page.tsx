import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import WrapperSmall from "@components/layout/WrapperSmall";
import H1 from "@components/typography/H1";
import H2 from "@components/typography/H2";
import H3 from "@components/typography/H3";
import H4 from "@components/typography/H4";

export const metadata: Metadata = {
    title: "Privacy Policy - Verivote",
};

function P({ children }: { children: ReactNode }) {
    return <p className="mb-4">{children}</p>;
}

export default function Page() {
    return (
        <WrapperSmall>
            <div className="py-24">
                <H1>Privacy Policy</H1>
                <H2>1. Data Protection at a Glance</H2>
                <H3>General Information</H3>
                <P>
                    The following information provides a simple overview of what happens to your personal data when you
                    visit this website. Personal data is any data with which you can be personally identified. For
                    detailed information on the subject of data protection, please refer to our privacy policy listed
                    below this text.
                </P>{" "}
                <H3>Data Collection on This Website</H3>{" "}
                <H4>Who is responsible for data collection on this website?</H4>{" "}
                <P>
                    Data processing on this website is carried out by the website operator. You can find their contact
                    details in the section &#34;Notice on the Responsible Party&#34; in this privacy policy.
                </P>{" "}
                <H4>How do we collect your data?</H4>
                <P>
                    Your data is collected firstly when you provide it to us. This could be data that you enter in a
                    contact form.
                </P>{" "}
                <P>
                    Other data is automatically collected or obtained through your consent when you visit the website.
                    This data is primarily technical (e.g., internet browser, operating system, or the time of page
                    access). This data is collected automatically as soon as you enter this website.
                </P>{" "}
                <H4>What do we use your data for?</H4>{" "}
                <P>
                    Part of the data is collected to ensure the error-free provision of the website. Other data may be
                    used to analyze your user behavior.
                </P>{" "}
                <H4>What rights do you have regarding your data?</H4>
                <P>
                    You have the right to receive information about the origin, recipients, and purpose of your stored
                    personal data at any time free of charge. You also have the right to request the correction or
                    deletion of this data. If you have given consent for data processing, you can withdraw this consent
                    at any time for the future. Furthermore, you have the right to request the restriction of processing
                    your personal data under certain circumstances. Additionally, you have the right to lodge a
                    complaint with the competent supervisory authority.
                </P>{" "}
                <P>You can contact us at any time regarding these and other questions about data protection.</P>{" "}
                <H2>2. Hosting</H2> <P>We host the contents of our website with the following provider:</P>{" "}
                <H3>Strato</H3>{" "}
                <P>
                    The provider is Strato AG, Otto-Ostrowski-Strasse 7, 10249 Berlin (hereinafter referred to as
                    &#34;Strato&#34;). When you visit our website, Strato collects various log files, including your IP
                    addresses.
                </P>{" "}
                <P>
                    For more information, please refer to Strato&#39;s privacy policy:{" "}
                    <Link
                        href="https://www.strato.de/datenschutz/"
                        target="_blank"
                        className="inline-link inline-link-resting"
                        rel="noopener noreferrer"
                    >
                        https://www.strato.de/datenschutz/
                    </Link>
                    .
                </P>{" "}
                <P>
                    The use of Strato is based on Art. 6(1)(f) GDPR. We have a legitimate interest in the most reliable
                    possible presentation of our website. If a corresponding consent has been requested, the processing
                    is carried out exclusively based on Art. 6(1)(a) GDPR and § 25(1) TDDG, insofar as the consent
                    includes the storage of cookies or access to information on the user’s device (e.g., device
                    fingerprinting) as defined by the TDDG. Consent can be revoked at any time.
                </P>{" "}
                <H4>Order Processing</H4>{" "}
                <P>
                    We have concluded a contract for order processing (AVV) with the above-mentioned provider. This is a
                    data protection-related contract required by law, which ensures that this provider processes the
                    personal data of our website visitors only according to our instructions and in compliance with the
                    GDPR.
                </P>{" "}
                <H2>3. General Information and Mandatory Notices</H2> <H3>Data Protection</H3>
                <P>
                    The operators of these pages take the protection of your personal data very seriously. We treat your
                    personal data confidentially and in accordance with statutory data protection regulations as well as
                    this privacy policy.
                </P>{" "}
                <P>
                    When you use this website, various personal data is collected. Personal data is data that can be
                    used to personally identify you. This privacy policy explains what data we collect and what we use
                    it for. It also explains how and for what purpose this happens.
                </P>{" "}
                <P>
                    We would like to point out that data transmission over the Internet (e.g., communication via email)
                    can have security gaps. A complete protection of data from access by third parties is not possible.
                </P>{" "}
                <H3>Notice on the Responsible Party</H3>{" "}
                <P>The responsible party for data processing on this website is:</P>
                <P>
                    {process.env.LEGAL_RESPONSIBLE_ENTITY}
                    <br />
                    {process.env.LEGAL_STREET}
                    <br />
                    {process.env.LEGAL_ZIP_AND_CITY}
                </P>
                <P>
                    Phone: {process.env.LEGAL_PHONE}
                    <br />
                    Email:{" "}
                    <Link href={`mailto:${process.env.LEGAL_EMAIL}`} className="inline-link inline-link-resting">
                        {process.env.LEGAL_EMAIL}
                    </Link>
                    <br />
                </P>{" "}
                <P>
                    The responsible party is the natural or legal person who, alone or jointly with others, determines
                    the purposes and means of processing personal data (e.g., names, email addresses, etc.).
                </P>{" "}
                <H3>Storage Duration</H3>{" "}
                <P>
                    Unless a more specific storage period has been specified within this privacy policy, your personal
                    data will remain with us until the purpose for the data processing no longer applies. If you make a
                    legitimate request for deletion or withdraw your consent to data processing, your data will be
                    deleted unless we have other legally permissible reasons for storing your personal data (e.g., tax
                    or commercial law retention periods); in the latter case, deletion will occur after these reasons no
                    longer apply.
                </P>{" "}
                <H3>General Information on the Legal Bases of Data Processing on This Website</H3>{" "}
                <P>
                    If you have consented to data processing, we process your personal data based on Art. 6(1)(a) GDPR
                    or Art. 9(2)(a) GDPR, if special categories of data are processed according to Art. 9(1) GDPR. In
                    the case of express consent to the transfer of personal data to third countries, data processing is
                    also carried out based on Art. 49(1)(a) GDPR. If you have consented to the storage of cookies or
                    access to information on your device (e.g., via device fingerprinting), data processing is also
                    based on § 25(1) TDDG. Consent can be revoked at any time. If your data is necessary for contract
                    fulfillment or for carrying out pre-contractual measures, we process your data based on Art. 6(1)(b)
                    GDPR. Furthermore, we process your data if it is necessary for the fulfillment of a legal obligation
                    based on Art. 6(1)(c) GDPR. Data processing may also be based on our legitimate interest according
                    to Art. 6(1)(f) GDPR. The respective legal bases for each individual case are explained in the
                    following sections of this privacy policy.
                </P>{" "}
                <H3>Recipients of Personal Data</H3>{" "}
                <P>
                    In the course of our business activities, we work with various external parties. This may require
                    the transfer of personal data to external parties. We only transfer personal data to external
                    parties if it is necessary for the fulfillment of a contract, if we are legally obligated to do so
                    (e.g., transfer of data to tax authorities), if we have a legitimate interest based on Art. 6(1)(f)
                    GDPR, or if another legal basis allows the data transfer. When using data processors, we only
                    transfer personal data of our customers based on a valid contract for order processing. In the case
                    of joint processing, a contract for joint processing is concluded.
                </P>{" "}
                <H3>Revocation of Your Consent to Data Processing</H3>{" "}
                <P>
                    Many data processing operations are only possible with your express consent. You can revoke your
                    consent at any time. The legality of the data processing carried out before the revocation remains
                    unaffected by the revocation.
                </P>{" "}
                <H3>Right to Object to Data Collection in Special Cases and to Direct Marketing (Art. 21 GDPR)</H3>{" "}
                <P>
                    IF THE DATA PROCESSING IS BASED ON ART. 6(1)(E) OR (F) GDPR, YOU HAVE THE RIGHT TO OBJECT TO THE
                    PROCESSING OF YOUR PERSONAL DATA AT ANY TIME FOR REASONS ARISING FROM YOUR PARTICULAR SITUATION;
                    THIS ALSO APPLIES TO PROFILING BASED ON THESE PROVISIONS. THE RESPECTIVE LEGAL BASIS FOR PROCESSING
                    CAN BE FOUND IN THIS PRIVACY POLICY. IF YOU OBJECT, WE WILL NO LONGER PROCESS YOUR AFFECTED PERSONAL
                    DATA UNLESS WE CAN DEMONSTRATE COMPELLING LEGITIMATE GROUNDS FOR THE PROCESSING THAT OVERRIDE YOUR
                    INTERESTS, RIGHTS, AND FREEDOMS OR THE PROCESSING SERVES TO ASSERT, EXERCISE, OR DEFEND LEGAL CLAIMS
                    (OBJECTION UNDER ART. 21(1) GDPR).
                </P>{" "}
                <P>
                    IF YOUR PERSONAL DATA IS PROCESSED FOR DIRECT MARKETING PURPOSES, YOU HAVE THE RIGHT TO OBJECT AT
                    ANY TIME TO THE PROCESSING OF YOUR PERSONAL DATA FOR SUCH MARKETING; THIS ALSO APPLIES TO PROFILING,
                    TO THE EXTENT THAT IT IS RELATED TO SUCH DIRECT MARKETING. IF YOU OBJECT, YOUR PERSONAL DATA WILL NO
                    LONGER BE USED FOR DIRECT MARKETING PURPOSES (OBJECTION UNDER ART. 21(2) GDPR).
                </P>{" "}
                <H3>Right to Lodge a Complaint with the Competent Supervisory Authority</H3>{" "}
                <P>
                    In the event of violations of the GDPR, data subjects have the right to lodge a complaint with a
                    supervisory authority, particularly in the member state of their habitual residence, place of work,
                    or the place of the alleged violation. This right exists without prejudice to other administrative
                    or judicial remedies.
                </P>{" "}
                <H3>Right to Data Portability</H3>{" "}
                <P>
                    You have the right to have data that we process based on your consent or in fulfillment of a
                    contract automatically delivered to yourself or a third party in a commonly used, machine-readable
                    format. If you request the direct transfer of the data to another responsible party, this will only
                    take place to the extent technically feasible.
                </P>{" "}
                <H3>SSL or TLS Encryption</H3>{" "}
                <P>
                    This site uses SSL or TLS encryption for security reasons and to protect the transmission of
                    confidential content, such as orders or inquiries that you send to us as the site operator. You can
                    recognize an encrypted connection by the fact that the address line of the browser changes from
                    &#34;http://&#34; to &#34;https://&#34; and by the lock symbol in your browser line.
                </P>
                <P>
                    If SSL or TLS encryption is activated, the data you transmit to us cannot be read by third parties.
                </P>
                <H3>Encrypted Payment Transactions on This Website</H3>{" "}
                <P>
                    If there is an obligation to provide us with your payment data (e.g., account number for direct
                    debit authorization) after the conclusion of a fee-based contract, this data is required for payment
                    processing.
                </P>{" "}
                <P>
                    Payment transactions using common means of payment (Visa/MasterCard, direct debit) are carried out
                    exclusively via an encrypted SSL or TLS connection. You can recognize an encrypted connection by the
                    fact that the browser’s address line changes from &#34;http://&#34; to &#34;https://&#34; and by the
                    lock symbol in your browser line.
                </P>{" "}
                <P>
                    In the case of encrypted communication, your payment data that you transmit to us cannot be read by
                    third parties.
                </P>{" "}
                <H3>Information, Deletion, and Correction</H3>{" "}
                <P>
                    Within the framework of the applicable legal provisions, you have the right at any time to obtain
                    free information about your stored personal data, its origin and recipients, and the purpose of the
                    data processing, and, if necessary, a right to correction or deletion of this data. You can contact
                    us at any time for this purpose and for further questions on the subject of personal data.
                </P>{" "}
                <H3>Right to Restrict Processing</H3>{" "}
                <P>
                    You have the right to request the restriction of the processing of your personal data. To do so, you
                    can contact us at any time. The right to restrict processing exists in the following cases:
                </P>
                <ul>
                    <li>
                        If you dispute the accuracy of your personal data stored by us, we usually need time to verify
                        this. For the duration of the verification, you have the right to request the restriction of the
                        processing of your personal data.
                    </li>
                    <li>
                        If the processing of your personal data was/is unlawful, you can request the restriction of data
                        processing instead of deletion.
                    </li>
                    <li>
                        If we no longer need your personal data, but you need it to exercise, defend, or assert legal
                        claims, you have the right to request the restriction of the processing of your personal data
                        instead of deletion.
                    </li>
                    <li>
                        If you have lodged an objection according to Art. 21(1) GDPR, a balance must be struck between
                        your interests and ours. As long as it has not yet been determined whose interests prevail, you
                        have the right to request the restriction of the processing of your personal data.
                    </li>
                </ul>
                <P>
                    If you have restricted the processing of your personal data, such data may only be processed – apart
                    from its storage – with your consent or for the assertion, exercise, or defense of legal claims, for
                    the protection of another natural or legal person, or for reasons of significant public interest of
                    the European Union or a member state.
                </P>
            </div>
        </WrapperSmall>
    );
}
