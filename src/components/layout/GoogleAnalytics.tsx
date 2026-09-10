import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const normalizedMeasurementId = measurementId?.trim().toUpperCase();

  if (
    !normalizedMeasurementId ||
    !GA_MEASUREMENT_ID_PATTERN.test(normalizedMeasurementId)
  ) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${normalizedMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${normalizedMeasurementId}');
        `}
      </Script>
    </>
  );
}
