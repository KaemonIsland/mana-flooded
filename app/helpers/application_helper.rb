module ApplicationHelper
  def full_title(page_title = '')
    title = "Mana Flooded"
    page_title.empty? ? title : "#{page_title} | #{title}"
  end
end
