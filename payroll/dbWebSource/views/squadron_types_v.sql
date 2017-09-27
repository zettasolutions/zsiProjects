CREATE VIEW dbo.squadron_types_v
AS
SELECT        dbo.squadron_types.squadron_type_id, dbo.squadron_types.squadron_type, dbo.squadron_types.is_active, dbo.squadron_types.created_by, dbo.squadron_types.created_date, dbo.squadron_types.updated_by,
                          dbo.squadron_types.updated_date, dbo.squadron_types.page_id, dbo.pages.page_title, dbo.pages.page_name
FROM            dbo.squadron_types LEFT OUTER JOIN
                         dbo.pages ON dbo.squadron_types.page_id = dbo.pages.page_id
WHERE        (ISNULL(dbo.squadron_types.page_id, 0) <> 0)
