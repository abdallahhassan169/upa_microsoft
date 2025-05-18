 
DROP TRIGGER IF EXISTS trg_notify_product_insert ON products;
DROP TRIGGER IF EXISTS trg_notify_product_update ON products;
DROP TRIGGER IF EXISTS trg_notify_product_delete ON products;

 
CREATE OR REPLACE FUNCTION public.notify_product_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  payload TEXT;
  action TEXT;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    action := 'insert';
    payload := json_build_object(
      'action', action,
      'id', NEW.id,
      'name', NEW.product_name,
      'desc', NEW.desc
    )::text;

  ELSIF (TG_OP = 'UPDATE') THEN
    action := 'update';
    payload := json_build_object(
      'action', action,
      'id', NEW.id,
      'name', NEW.product_name,
      'desc', NEW.desc
    )::text;

  ELSIF (TG_OP = 'DELETE') THEN
    action := 'delete';
    payload := json_build_object(
      'action', action,
      'id', OLD.id
    )::text;

  END IF;

  PERFORM pg_notify('product_change', payload);
  RETURN NULL;
END;
$$;

 
CREATE TRIGGER trg_notify_product_insert
AFTER INSERT ON products
FOR EACH ROW EXECUTE FUNCTION notify_product_change();

CREATE TRIGGER trg_notify_product_update
AFTER UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION notify_product_change();

CREATE TRIGGER trg_notify_product_delete
AFTER DELETE ON products
FOR EACH ROW EXECUTE FUNCTION notify_product_change();
