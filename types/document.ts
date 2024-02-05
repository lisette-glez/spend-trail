export interface Document {
  api_request: {
    error: {
      message: string;
    };
    resources: string[];
    status: string;
    status_code: number;
    url: string;
  };
  document: {
    id: string;
    inference: {
      extras: {};
      finished_at: string;
      is_rotation_applied: boolean;
      pages: [
        {
          extras: {};
          id: number;
          orientation: {
            value: number;
          };
          prediction: {
            customer_address: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            customer_company_registrations: number[];
            customer_name: {
              confidence: number;
              polygon: number[];
              raw_value: string;
              value: string;
            };
            document_type: {
              value: string;
            };
            date: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            due_date: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            invoice_number: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            line_items: [
              {
                confidence: number;
                description: string;
                polygon: number[];
                product_code: string;
                quantity: number;
                tax_amount: number;
                tax_rate: number;
                total_amount: number;
                unit_price: number;
              }
            ];
            locale: {
              confidence: number;
              currency: string;
              language: string;
            };
            orientation: {
              confidence: number;
              degrees: number;
            };
            reference_numbers: [
              {
                confidence: number;
                polygon: number[];
                value: string;
              }
            ];
            supplier_address: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            supplier_company_registrations: number[];
            supplier_name: {
              confidence: number;
              polygon: number[];
              raw_value: string;
              value: string;
            };
            supplier_payment_details: number[];
            taxes: number[];
            total_amount: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            total_net: {
              confidence: number;
              polygon: number[];
              value: string;
            };
            total_tax: {
              confidence: number;
              polygon: number[];
              value: string;
            };
          };
        }
      ];
      prediction: {
        customer_address: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: string;
        };
        customer_company_registrations: number[];
        customer_name: {
          confidence: number;
          page_id: number;
          polygon: number[];
          raw_value: string;
          value: string;
        };
        document_type: {
          value: string;
        };
        date: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: Date;
        };
        due_date: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: string;
        };
        invoice_number: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: string;
        };
        line_items: [
          {
            confidence: number;
            description: string;
            page_id: number;
            polygon: number[];
            product_code: string;
            quantity: number;
            tax_amount: number;
            tax_rate: number;
            total_amount: number;
            unit_price: number;
          }
        ];
        locale: {
          confidence: number;
          currency: string;
          language: string;
        };
        orientation: {
          confidence: number;
          degrees: number;
        };
        reference_numbers: [
          {
            confidence: number;
            page_id: number;
            polygon: number[];
            value: string;
          }
        ];
        supplier_address: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: string;
        };
        supplier_company_registrations: number[];
        supplier_name: {
          confidence: number;
          page_id: number;
          polygon: number[];
          raw_value: string;
          value: string;
        };
        supplier_payment_details: number[];
        taxes: number[];
        total_amount: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: number;
        };
        total_net: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: number;
        };
        total_tax: {
          confidence: number;
          page_id: number;
          polygon: number[];
          value: number;
        };
        category: {
          value: string;
        };
        subcategory: {
          value: string;
        };
        tip: {
          value: number;
        };
      };
      processing_time: number;
      product: {
        features: string[];
        name: string;
        type: string;
        version: string;
      };
      started_at: string;
    };
    n_pages: number;
    name: string;
  };
}