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
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${normalizedMeasurementId}`}
      />
      <script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${normalizedMeasurementId}');
        `,
        }}
      />
    </>
  );
}
