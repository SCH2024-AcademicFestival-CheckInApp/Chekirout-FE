import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function PrizeAlert() {
  return (
    <Alert className="mb-6">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle className="font-black">경품 수령 유형 안내</AlertTitle>
      <AlertDescription>
        <div className="font-black mt-2">수령 유형 구분</div>
        <ul className="list-disc list-inside mt-1">
          <li>단일 수령: 동일 유형의 다른 경품과 중복 수령이 불가능한 상품</li>
          <li>중복 수령: 다른 경품과 자유롭게 중복 수령이 가능한 상품</li>
        </ul>

        <div className="font-black mt-4">수령 가능 조합</div>
        <ul className="list-disc list-inside mt-1">
          <li>
            중복 수령 + 중복 수령: 가능
            <ul className="list-inside ml-4">
              <li>
                중복 수령으로 설정된 경품들은 서로 자유롭게 중복 수령 가능
              </li>
            </ul>
          </li>
          <li>
            단일 수령 + 중복 수령: 가능
            <ul className="list-inside ml-4">
              <li>단일 수령 경품은 중복 수령 경품과 함께 수령 가능</li>
            </ul>
          </li>
          <li>
            단일 수령 + 단일 수령: 불가능
            <ul className="list-inside ml-4">
              <li>단일 수령으로 설정된 경품들은 서로 중복 수령 불가</li>
            </ul>
          </li>
        </ul>
        <p className="mt-4 font-semibold text-red-500">
          ※ 경품 등록 시 수령 유형 설정에 유의해 주시기 바랍니다.
        </p>
      </AlertDescription>
    </Alert>
  );
}
